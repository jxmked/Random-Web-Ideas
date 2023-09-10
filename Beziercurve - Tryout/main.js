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

canvas.width = (size.w * 300) / resolution;
canvas.height = (size.h * 300) / resolution;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function clearCtx() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function move(x, y) {
  ctx.moveTo(x, y);
}

function line(x, y) {
  ctx.lineTo(x, y);
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
      timeMap.removeChild(timeMap.childNodes[59]);
    } catch (err) {
      console.log(err);
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
      move(canvas.width * coor.x, canvas.height * coor.y);
    } else {
      line(canvas.width * coor.x, canvas.height * coor.y);
    }
  }

  ctx.strokeStyle = "#00ff00";
  ctx.stroke();

  P1.update();
  P2.update();
  P1.display(ctx);
  P2.display(ctx);

  window.requestAnimationFrame(loop);
}

loop();

const last_coor = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

canvas.addEventListener("touchstart", function (evt) {
  evt.preventDefault();

  const { clientX, clientY } = evt.touches[0];

  last_coor[0].x = translatedX(canvas, clientX);
  last_coor[0].y = translatedY(canvas, clientY);

  last_coor[1].x = translatedX(canvas, clientX);
  last_coor[1].y = translatedY(canvas, clientY);

  P1.onTouchStart(last_coor[0]);
  P2.onTouchStart(last_coor[1]);
});

canvas.addEventListener("touchmove", function (evt) {
  evt.preventDefault();

  const { clientX, clientY } = evt.touches[0];

  last_coor[0].x = translatedX(canvas, clientX);
  last_coor[0].y = translatedY(canvas, clientY);

  last_coor[1].x = translatedX(canvas, clientX);
  last_coor[1].y = translatedY(canvas, clientY);

  P1.onTouchMove(last_coor[0]);
  P2.onTouchMove(last_coor[1]);
});

canvas.addEventListener("touchend", function (evt) {
  evt.preventDefault();

  P1.onTouchEnd(last_coor[0]);
  P2.onTouchEnd(last_coor[1]);
});
