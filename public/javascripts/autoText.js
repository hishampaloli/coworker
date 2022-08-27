const textEl = document.getElementById("text");
const speedEl = document.getElementById("speed");
const text = ["I am a web developer", "I make Awsome Websites"];
let idx = 1;
let c = 0;
let speed = 300 / 2;

writeText();

function writeText() {
  textEl.innerText = text[c].slice(0, idx);
  idx++;

  if (idx > text[c].length) {
    idx = 1;
    c++;
  }
  if (c > 1) {
    c = 0;
  }

  setTimeout(writeText, speed);
}
