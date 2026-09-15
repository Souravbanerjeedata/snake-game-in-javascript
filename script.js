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
});
