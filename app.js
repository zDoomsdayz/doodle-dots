let chosenSize = 16;
let gridOn = true;

const toggleMap = new Map();
toggleMap.set("pencil", true);

const ERASER_COLOR = "#FFFFFF";
const DEFAULT_PEN_COLOR = "#000000";

function start() {
  setToggle();
  updateGrid(chosenSize);
  document.documentElement.style.setProperty("--color", DEFAULT_PEN_COLOR);
  document.querySelector("#color").addEventListener("input", handleUpdate);
  document.querySelector("#size").addEventListener("input", updateBoardSizeLabel);
  document.querySelector("#size").addEventListener("click", updateBoardSize);
}

function updateGrid(num) {
  chosenSize = num;
  container.replaceChildren();
  container.style.setProperty("--grid-rows", num);
  container.style.setProperty("--grid-cols", num);
  for (i = 0; i < num * num; i++) {
    let cell = document.createElement("div");
    cell.style.backgroundColor = ERASER_COLOR;
    cell.addEventListener("mouseenter", (e) => e.buttons > 0 && updateCell(cell));
    cell.addEventListener("click", () => updateCell(cell));
    container.appendChild(cell).className = "grid-item";
  }
}

// reset all button and only show the selected button
function setToggle() {
  const buttons = document.querySelectorAll(".tools");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => {
        btn.classList.remove("selected");
        btn.dataset.selected = "false";
        toggleMap[btn.id] = false;
      });

      button.classList.add("selected");
      button.dataset.selected = "true";
      toggleMap[button.id] = true;
    });
  });

  // force select pencil when color is selected
  document.querySelector("#color").addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("selected");
      btn.dataset.selected = "false";
      toggleMap[btn.id] = false;
    });

    document.querySelector("#pencil").classList.add("selected");
    document.querySelector("#pencil").dataset.selected = "true";
    toggleMap["pencil"] = true;
  });
}

function rgbToHex(rgb) {
  let values = rgb.match(/\d+/g);
  let r = parseInt(values[0]);
  let g = parseInt(values[1]);
  let b = parseInt(values[2]);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function getRandomRGBColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function modifyRGBToHSL(rgb, modification) {
  let values = rgb.match(/\d+/g);
  let r = parseInt(values[0]) / 255;
  let g = parseInt(values[1]) / 255;
  let b = parseInt(values[2]) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100) + "%";

  // Ensure l is between 0 and 100 after the modification
  l = Math.max(0, Math.min(Math.round(l * 100 + modification), 100)) + "%";
  return "hsl(" + h + ", " + s + ", " + l + ")";
}

function updateCell(cell) {
  if (toggleMap["eraser"]) cell.style.backgroundColor = ERASER_COLOR;
  else if (toggleMap["picker"]) {
    // change the css --color color to picker color
    document.documentElement.style.setProperty(`--color`, rgbToHex(cell.style.backgroundColor));
    document.querySelector("#color").value = rgbToHex(cell.style.backgroundColor);
  } else if (toggleMap["rainbow"]) cell.style.backgroundColor = rgbToHex(getRandomRGBColor());
  else if (toggleMap["darken"]) cell.style.backgroundColor = modifyRGBToHSL(cell.style.backgroundColor, -10);
  else if (toggleMap["lighten"]) cell.style.backgroundColor = modifyRGBToHSL(cell.style.backgroundColor, 10);
  else cell.style.backgroundColor = document.documentElement.style.getPropertyValue("--color");
}

function updateBoardSize() {
  updateGrid(this.value);
}

function updateBoardSizeLabel() {
  document.querySelector("#size-label").innerHTML = this.value + " X " + this.value;
}

function handleUpdate(e) {
  //update the css --color color immediately whenever theres changes
  const suffix = this.dataset.sizing || "";
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
}

function toggleGrid() {
  gridOn = !gridOn;
  const gridButton = document.querySelector("#grid-btn");

  gridOn ? gridButton.classList.add("selected") : gridButton.classList.remove("selected");
  document.documentElement.style.setProperty("--grid-active", `${+gridOn}px`);
}

function reset() {
  updateGrid(chosenSize);
}

start();
