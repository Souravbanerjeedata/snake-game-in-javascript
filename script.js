window.addEventListener("load", function () {
  window.focus();
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

  function getDirection(first, second) {
    if (first - 1 === second) return "right";
    if (first + 1 === second) return "left";
    if (first + width === second) return "up";
    if (first - width === second) return "down";
    throw Error("the two tiles are noot connected");
  }

  function headDirection() {
    const head = snakePositions[snakePositions.length - 1];
    const neck = snakePositions[snakePositions.length - 2];
    return getDirection(head, neck);
  }

  function tailDirection() {
    const tail1 = snakePositions[0];
    const tail2 = snakePositions[1];
    return getDirection(tail1, tail2);
  }

  window.addEventListener("keydown", function (event) {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(
        event.key,
      )
    )
      return;

    event.preventDefault();
    // Space
    if (event.key === " ") {
      resetGame();
      startGame();
      return;
    }
    // Left
    if (event.key === "ArrowLeft" && headDirection() !== "right") {
      inputs.push("left");
      if (!gameStarted) startGame();
    }
    // Right
    if (event.key === "ArrowRight" && headDirection() !== "left") {
      inputs.push("right");
      if (!gameStarted) startGame();
    }
    // Up
    if (event.key === "ArrowUp" && headDirection() !== "down") {
      inputs.push("up");
      if (!gameStarted) startGame();
    }
    // Down
    if (event.key === "ArrowDown" && headDirection() !== "up") {
      inputs.push("down");
      if (!gameStarted) startGame();
    }
  });
});
