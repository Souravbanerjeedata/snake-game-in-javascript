window.addEventListener("load", function () {
  // Game data
  let snakePositions;
  let applePosition;
  let score = 0;
  let contrast = 1;
  let inputs = [];
  let gameStarted = false;
  let hardMode = false;

  // Configuration
  const speed = 200;
  let fadeSpeed = 5000;
  let fadeExponential = 1.024;
  const contrastIncrease = 0.5;
  const color = "black";

  const width = 15;
  const height = 15;

  const grid = document.querySelector(".grid");

  for (let i = 0; i < width * height; i++) {
    const content = document.createElement("div");
    content.className = "content";

    const tile = document.createElement("div");
    tile.className = "tile";
    tile.appendChild(content);

    grid.appendChild(tile);
  }

  const tiles = document.querySelectorAll(".grid .tile .content");

  function setTile(element, overrides = {}) {
    const defaults = {
      width: "100%",
      height: "100%",
      top: "auto",
      right: "auto",
      bottom: "auto",
      left: "auto",
      "background-color": "transparent",
    };
    const cssProperties = { ...defaults, ...overrides };
    element.style.cssText = Object.entries(cssProperties)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
  }

  function resetGame() {
    snakePositions = [168, 169, 170, 171]; // starting snake
    applePosition = 100;

    score = 0;
    contrast = 1;
    inputs = [];

    // clear all tiles
    for (const tile of tiles) setTile(tile);

    // draw apple
    setTile(tiles[applePosition], {
      "background-color": color,
      "border-radius": "50%",
    });

    // draw snake body
    for (const i of snakePositions) {
      tiles[i].style.backgroundColor = color;
    }
  }

  resetGame(); // call it once at the start
});
