const canvas = document.querySelector("#main-canvas");
const ctx = canvas.getContext("2d");
const time_vis = document.querySelector("#time");
const timeMap = document.querySelector("#time-map");
const resolution = 300;
const size = {
  w: 500,
  h: 500,
};

const P1 = new Coor_button(
  canvas,
  { width: 50, height: 50 },
  { x: 100, y: 100 },
  "#ff0000",
);
const P2 = new Coor_button(
  canvas,
  { width: 50, height: 50 },
  { x: 300, y: 300 },
  "#ff00ff",
);

const pointObject = [P1, P2];

canvas.width = (size.w * 300) / resolution;
canvas.height = (size.h * 300) / resolution;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function clearCtx() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function flip_range(min, max, value) {
  return max - (value - min);
}

let lastStr = "";

function insertTimeMap(t, a, b) {
  let str = `${t}: ${a.x.toFixed(5)} - ${a.y.toFixed(5)}`;
  str += ` | ${b.x.toFixed(5)} - ${b.y.toFixed(5)}`;

  if (lastStr === str) return;

  const e = document.createElement("span");
  e.innerText = str;
  lastStr = str;

  timeMap.insertBefore(e, timeMap.childNodes[0]);

  // remove elements from after 50 nodes
  while (timeMap.childNodes.length > 50) {
    try {
      timeMap.removeChild(timeMap.childNodes[50]);
    } catch (err) {
      break;
    }
  }
}

function quadraticBezier(t, p0, p1, p2, p3) {
  const cX = 3 * (p1.x - p0.x);
  const bX = 3 * (p2.x - p1.x);
  const aX = p3.x - p0.x - cX - bX;

  const cY = 3 * (p1.y - p0.y);
  const bY = 3 * (p2.y - p1.y) - cY;
  const aY = p3.y - p0.y - cY - bY;

  const pow3 = Math.pow(t, 3);
  const pow2 = Math.pow(t, 2);

  const x = aX * pow3 + bX * pow2 + cX * t + p0.x;
  const y = aY * pow3 + bY * pow2 + cY * t + p0.y;

  return { x, y };
}

const sPos = { x: 0, y: 0 };
const ePos = { x: 1, y: 1 };

function getBezPoint(P) {
  return {
    x: P.position.x / canvas.width,
    y: P.position.y / canvas.height,
  };
}

function loop() {
  clearCtx();

  const Pa = getBezPoint(P1);
  const Pb = getBezPoint(P2);

  insertTimeMap(0, Pa, Pb);

  for (let t = 0; t < 100; t++) {
    const coor = quadraticBezier(t / 100, sPos, Pa, Pb, ePos);

    if (t <= 0) {
      ctx.moveTo(canvas.width * coor.x, canvas.height * coor.y);
    } else {
      ctx.lineTo(canvas.width * coor.x, canvas.height * coor.y);
    }
  }

  ctx.strokeStyle = "#00ff00";
  ctx.stroke();

  for (const po of pointObject) {
    po.update();
    po.display(ctx);
  }

  window.requestAnimationFrame(loop);
}

loop();

/**
 * Added some multi touch support
 * */
function eventDown(evt) {
  evt.preventDefault();

  for (const { clientX, clientY, identifier } of evt.touches) {
    const x = translatedX(canvas, clientX);
    const y = translatedY(canvas, clientY);

    for (const po of pointObject) {
      po.onTouchStart({ x, y }, identifier);

      // Preventing all movable object to be moved
      // by a single identifier
      if (identifier === po.registered_id) break;
    }
  }
}

function eventMove(evt) {
  evt.preventDefault();

  for (const { clientX, clientY, identifier } of evt.touches) {
    const x = translatedX(canvas, clientX);
    const y = translatedY(canvas, clientY);

    for (const po of pointObject) {
      po.onTouchMove({ x, y }, identifier);
    }
  }
}

function eventUp(evt) {
  evt.preventDefault();

  const working_ids = new Array(evt.touches.length)
    .fill(0)
    .map(function (e, i) {
      return evt.touches[i].identifier;
    });

  for (const po of pointObject) {
    if (po.registered_id in working_ids) continue;

    po.onTouchEnd({ x: 0, y: 0 }, po.registered_id);
  }
}

canvas.addEventListener("touchstart", eventDown);
canvas.addEventListener("touchmove", eventMove);
canvas.addEventListener("touchend", eventUp);

canvas.addEventListener("mousedown", function (evt) {
  const { clientX, clientY } = evt;

  const x = translatedX(canvas, clientX);
  const y = translatedY(canvas, clientY);

  for (const po of pointObject) {
    po.onTouchStart({ x, y }, 0);
  }
});

canvas.addEventListener("mousemove", function (evt) {
  const { clientX, clientY } = evt;

  const x = translatedX(canvas, clientX);
  const y = translatedY(canvas, clientY);

  for (const po of pointObject) {
    po.onTouchMove({ x, y }, 0);
  }
});

canvas.addEventListener("mouseup", function (evt) {
  for (const po of pointObject) {
    po.onTouchEnd({ x: 0, y: 0 }, 0);
  }
});
