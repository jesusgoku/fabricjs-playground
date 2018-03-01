export {
  rotatePointArroundPoint,
  rotatePoint,
  subVector2Point,
  sumVector2Point,
  mm2DPIPx,
};


function rotatePointArroundPoint(p, ap, angle) {
  const pPrime = subVector2Point(p, ap);
  const pRotated = rotatePoint(pPrime, angle);
  return sumVector2Point(pRotated, ap);
}

function rotatePoint(p, angle) {
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.y * Math.cos(angle) + p.x * Math.sin(angle),
  };
}

function subVector2Point(p, v) {
  return {
    x: p.x - v.x,
    y: p.y - v.y,
  };
}

function sumVector2Point(p, v) {
  return {
    x: p.x + v.x,
    y: p.y + v.y,
  };
}

function mm2DPIPx(mm, dpi = 300) {
  return mm * (1 / 25.4) * dpi;
}
