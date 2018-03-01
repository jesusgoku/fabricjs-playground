<template>
  <div>
    <button v-on:click="handleAddCircle">Add circle</button>
    <button v-on:click="handleAddRect">Add rect</button>
    <button v-on:click="handleToggleRotated">Toggle Rotate</button>
    {{ zoom }}
    <input type="range" v-model="zoom" min="0.1" max="3" step="0.1">
    <div ref="canvasWrapper"></div>
  </div>
</template>


<script>
import Fabric from '../fabric/Fabric';

export default {
  name: 'Canvas',
  data: function () {
    return {
      canvas: null,
      zoom: 1,
      template: {
        label_width: 32,
        label_height: 32,
        label_container_width: 35,
        label_container_height: 35,
        label_cols: 6,
        label_rows: 8,
        layout_width: 216,
        layout_height: 279,
        layout_margin_top: 0,
        layout_margin_side: 3.00,
        is_circular: 1,
      },
    };
  },
  watch: {
    zoom: function(zoomValue) {
      console.log(zoomValue);
      this.canvas.setZoom(zoomValue);
    },
  },
  mounted: function () {
    this.canvas = new Fabric(this.$refs.canvasWrapper, this.template);
  },
  methods: {
    handleAddCircle: function() {
      this.canvas.addCircle();
    },
    handleAddRect: function() {
      this.canvas.addRect();
    },
    handleToggleRotated: function() {
      this.canvas.toggleRotated();
    },
  },
}

</script>

<style scoped>

</style>
