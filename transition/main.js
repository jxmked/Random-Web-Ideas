const btn = document.querySelector("#btn");
const out = document.querySelector("#out");
const ss = document.querySelector("#ss");

let start = 0;
let duration = 3000; // ms
let last = 0;

let ival = setInterval(() => {
  const ms = performance.now();
  const diff = last - start;

  if (diff < duration) {
    out.innerText = diff / duration;
  }

  last = ms;
}, 10);

let count = 0;
btn.onclick = () => {
  count++;
  start = (performance.now()) - (3000 * 0.4);
  ss.innerText = count;
}  