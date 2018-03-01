import fabric from 'fabric';

import {
  mm2DPIPx,
  rotatePointArroundPoint,
} from './helpers';

export default class Canvas {
  constructor(canvasWrapperEl, template, options = {}) {
    this.canvasWrapperEl = canvasWrapperEl;
    this.canvasEl = document.createElement('canvas');
    this.canvasWrapperEl.appendChild(this.canvasEl);
    this.template = template;
    this.options = options;
    this.rotated = false;

    this.viewPortSize = {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };

    this.labelContainerSize = {
      width: mm2DPIPx(this.template.label_container_width),
      height: mm2DPIPx(this.template.label_container_height),
    };

    this.labelSize = {
      width: mm2DPIPx(this.template.label_width),
      height: mm2DPIPx(this.template.label_height),
    };

    this.canvasSize = {
      width: this.labelSize.width * 2,
      height: this.labelSize.height * 2,
    };

    this.canvasWrapperEl.style.width = `${this.viewPortSize.width}px`;
    this.canvasWrapperEl.style.height = `${this.viewPortSize.height}px`;
    this.canvasWrapperEl.style.overflow = 'auto';

    this.canvas = new fabric.Canvas(this.canvasEl, { ...this.canvasSize
    });

    this.canvasWrapperEl.scrollTo(
      (this.canvasEl.offsetWidth - this.canvasWrapperEl.offsetWidth) / 2,
      (this.canvasEl.offsetHeight - this.canvasWrapperEl.offsetHeight) / 2
    );

    this.drawLabel();
  }

  drawLabel() {
    this.labelContainer = new fabric.Rect({
      ...this.labelContainerSize,
      left: 0,
      top: 0,
      fill: 'transparent',
      stroke: 'grey',
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    this.label = new fabric.Rect({
      ...this.labelSize,
      left: 0,
      top: 0,
      fill: 'transparent',
      stroke: 'grey',
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });

    this.canvas.add(this.labelContainer).centerObject(this.labelContainer);
    this.canvas.add(this.label).centerObject(this.label);
  }

  getDefaultSize(size = null) {
    return {
      width: this.labelSize.width * 0.5,
      height: this.labelSize.height * 0.5,
    };
  }

  getInitialScale(objectSize) {
    if (objectSize.width > this.labelSize.width ||
      objectSize.height > this.labelSize.height) {
      const isLandscape = objectSize.width > objectSize.height;
      const scaleProp = isLandscape ? 'width' : 'height';
      return this.labelSize[scaleProp] * 0.5 / objectSize[scaleProp];
    } else {
      return 1;
    }
  }

  addRect(options = {}) {
    const fObject = new fabric.Rect({
      ...this.getDefaultSize(),
      fill: '#FFCC00',
      stroke: '#0099CC',
      strokeWidth: 5,
      ...options,
    });
    this.canvas.add(fObject).centerObject(fObject);
  }

  addCircle(options = {}) {
    const fObject = new fabric.Circle({
      radius: this.getDefaultSize().width / 2,
      fill: '#FFCC00',
      stroke: '#0099CC',
      strokeWidth: 5,
      ...options,
    });
    this.canvas.add(fObject).centerObject(fObject);
  }

  getLabelCanvas() {
    const canvas = new fabric.Canvas(null, {
      width: this.labelContainer.get('width'),
      height: this.labelContainer.get('height'),
    });

    this
      .canvas
      .getObjects()
      .filter(o => o.get('selectable'))
      .map(o => {
        o.clone(o => {
          o.set({
            left: o.get('left') - this.labelContainer.get('left'),
            top: o.get('top') - this.labelContainer.get('top'),
          });
          canvas.add(o);
        });
      });

    return canvas;
  }

  restoreLabelCanvas(canvas) {
    if (!(canvas instanceof fabric.Canvas)) {
      const c = new fabric.Canvas(null);
      c.loadFromJSON(canvas, () => {
        this._restoreLabelCanvas(c);
      });
    } else {
      this._restoreLabelCanvas(canvas);
    }
  }

  _restoreLabelCanvas(canvas) {
    canvas
      .getObjects()
      .map(o => {
        o.clone(o => {
          o.set({
            left: o.get('left') + this.labelContainer.get('left'),
            top: o.get('top') + this.labelContainer.get('top'),
          });
          this.canvas.add(o);
        });
      });
  }

  toggleRotated() {
    this.canvas.discardActiveObject();
  
    const canvasCenter = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
    
    this
      .canvas
      .getObjects()
      // .filter(o => o.selectable)
      .forEach(o => {
        const p = {
          x: o.left,
          y: o.top,
        };
        const angle = this.rotated ? Math.PI / 2 * -1 : Math.PI / 2;
        const pRotated = rotatePointArroundPoint(p, canvasCenter, angle);
        const sign = this.rotated ? '-' : '+';
        o.animate('angle', `${sign}=90`, { onChange: this.canvas.renderAll.bind(this.canvas) });
        o.animate('top', pRotated.y, { onChange: this.canvas.renderAll.bind(this.canvas) });
        o.animate('left', pRotated.x, { onChange: this.canvas.renderAll.bind(this.canvas) });
        
      })
    ;
    this.canvas.requestRenderAll();
    this.rotated = !this.rotated;
  }

  setZoom(value) {
    const zoom = parseFloat(value);
    this.canvas.setZoom(zoom);
    this.canvas.setWidth(this.canvasSize.width * zoom);
    this.canvas.setHeight(this.canvasSize.height * zoom);
    this.canvasWrapperEl.scrollTo(
      (this.canvasEl.offsetWidth - this.canvasWrapperEl.offsetWidth) / 2,
      (this.canvasEl.offsetHeight - this.canvasWrapperEl.offsetHeight) / 2
    );
  }
}
