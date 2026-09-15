window.addEventListener("load", function () {
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
  const tiles = document.querySelectorAll(".grid, .content, .tile");

  function setTile(element, overrides = {}) {
    const defaults = {
      width: "100%",
      height: "100%",
      top: "auto",
      bottom: "auto",
      right: "auto",
      left: "auto",
      "background-color": "transparent",
    };

    const cssProperties = { ...defaults, ...overrides };
    element.style.cssText = Object.entries(cssProperties)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" ");
  }
});
