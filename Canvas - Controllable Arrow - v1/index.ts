const canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
const btn = {
  left: <HTMLButtonElement>document.getElementById("left")!,
  right: <HTMLButtonElement>document.getElementById("right")!,
  up: <HTMLButtonElement>document.getElementById("up")!,
  down: <HTMLButtonElement>document.getElementById("down")!,
  upLeft: <HTMLButtonElement>document.getElementById("up-left")!,
  upRight: <HTMLButtonElement>document.getElementById("up-right")!,
  downLeft: <HTMLButtonElement>document.getElementById("down-left")!,
  downRight: <HTMLButtonElement>document.getElementById("down-right")!,
};

const ctx = canvas.getContext("2d")!;
const currentPos = {
  w: 0,
  h: 0,
};

const speed = 5;
const size = 30;
const rapidTrigger = 1;
const isOutline = false;
const reboundBounce = 20;

/** Triangle Object */
function triangle(x: number, y: number) {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  let { w, h } = currentPos;
  w += x;
  h += y;

  // Lets add some boundaries
  if (w <= 0 + size) w = 0 + size + reboundBounce;
  else if (w >= width - size) w = width - size - reboundBounce;

  if (h <= 0) h = 0 + reboundBounce;
  else if (h >= height - size * 2) h = height - size * 2 - reboundBounce;

  // Draw Our Triangle
  ctx.beginPath();

  // Start the cursor in x, y position
  ctx.moveTo(w, h);

  // From current cursor position to next x,y position
  ctx.lineTo(w + size, h + size * 2);
  ctx.lineTo(w - size, h + size * 2);

  // Put back our cursor into moveTo position
  ctx.closePath();

  // Styling
  if (isOutline) {
    ctx.strokeStyle = "blue"; // Outline
    ctx.lineWidth = 2;
    ctx.stroke(); // Outline
  } else {
    ctx.fillStyle = "blue";
    ctx.fill();
  }

  // Save last position
  currentPos.w = w;
  currentPos.h = h;
}

// Always set canvas dimension into max window size
window.addEventListener("resize", () => {
  // Anti Alias
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;

  currentPos.w = Math.abs(canvas.width / 2);
  currentPos.h = Math.abs(canvas.height / 2) - Math.ceil(size / 2);
  triangle(0, 0);
});

// Trigger Resize Event
window.dispatchEvent(new Event("resize"));

function Start(data: { [id: string]: any }) {
  // Click Every 100ms
  data["ival"] = setInterval(() => {
    data["main"]();
  }, rapidTrigger);
}

function Stop(data: { [id: string]: any }) {
  clearInterval(data["ival"]);
}

const factory = (e: HoldButton, x: number, y: number) => {
  e.onClick(() => triangle(x, y));
  e.onHold(Start, 400);
  e.onUnHold(Stop);
};

factory(new HoldButton(btn.up), 0, -speed);
factory(new HoldButton(btn.down), 0, speed);
factory(new HoldButton(btn.left), -speed, 0);
factory(new HoldButton(btn.right), speed, 0);
factory(new HoldButton(btn.upLeft), -speed, -speed);
factory(new HoldButton(btn.upRight), speed, -speed);
factory(new HoldButton(btn.downLeft), -speed, speed);
factory(new HoldButton(btn.downRight), speed, speed);
