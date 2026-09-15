window.addEventListener("load", function (event) {
  window.focus(); // Capture keys right away

  let snakePositions; // Array of snake tile indexes (head is last)
  let applePosition; // Current apple tile index

  let startTimestamp; // When the animation started
  let lastTimestamp; // Previous frame time
  let stepsTaken; // How many full steps the snake has taken
  let score;
  let contrast;

  let inputs; // Queue of upcoming directions

  let gameStarted = false;
  let hardMode = false;

  // Configuration
  const width = 15;
  const height = 15;
  const speed = 200; // ms per step
  let fadeSpeed = 5000; // how fast the board fades
  let fadeExponential = 1.024;
  const contrastIncrease = 0.5;
  const color = "#00ff9d"; // neon green for snake

  const grid = document.querySelector(".grid");
  for (let i = 0; i < width * height; i++) {
    const content = document.createElement("div");
    content.setAttribute("class", "content");
    content.setAttribute("id", i); // just for debugging

    const tile = document.createElement("div");
    tile.setAttribute("class", "tile");
    tile.appendChild(content);

    grid.appendChild(tile);
  }

  const tiles = document.querySelectorAll(".grid .tile .content");

  // DOM elements we will update later
  const containerElement = document.querySelector(".container");
  const noteElement = document.querySelector("footer");
  const contrastElement = document.querySelector(".contrast");
  const scoreElement = document.querySelector(".score");

  resetGame();

  function resetGame() {
    // Starting positions
    snakePositions = [168, 169, 170, 171];
    applePosition = 100;

    // Reset progress
    startTimestamp = undefined;
    lastTimestamp = undefined;
    stepsTaken = -1;
    score = 0;
    contrast = 1;
    inputs = [];

    // Update header
    contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
    scoreElement.innerText = hardMode ? `H ${score}` : score;

    // Clear all tiles
    for (const tile of tiles) {
      setTile(tile);
      tile.className = "content";
    }

    // Draw apple
    const appleTile = tiles[applePosition];
    setTile(appleTile, {
      "background-color": "#ff2a6d",
      "border-radius": "50%",
    });
    appleTile.classList.add("apple");

    // Draw snake body
    for (let idx = 0; idx < snakePositions.length; idx++) {
      const i = snakePositions[idx];
      const snakePart = tiles[i];
      snakePart.style.backgroundColor = color;
      snakePart.classList.add("snake");

      // Head gets special class
      if (idx === snakePositions.length - 1) {
        snakePart.classList.add("snake-head");
      }

      // Prepare head and tail for transitions
      if (i == snakePositions[snakePositions.length - 1])
        snakePart.style.left = 0;
      if (i == snakePositions[0]) snakePart.style.right = 0;
    }
  }

  window.addEventListener("keydown", function (event) {
    if (
      ![
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        " ",
        "H",
        "h",
        "E",
        "e",
      ].includes(event.key)
    )
      return;

    event.preventDefault();

    // Space = restart
    if (event.key == " ") {
      resetGame();
      startGame();
      return;
    }

    // H = hard mode
    if (event.key == "H" || event.key == "h") {
      hardMode = true;
      fadeSpeed = 4000;
      fadeExponential = 1.025;
      noteElement.innerHTML = `
        <div class="footer-main">HARD MODE activated</div>
        <div class="footer-sub">Press <kbd>SPACE</kbd> to start • Press <kbd>E</kbd> for easy</div>
      `;
      noteElement.style.opacity = 1;
      resetGame();
      return;
    }

    // E = easy mode
    if (event.key == "E" || event.key == "e") {
      hardMode = false;
      fadeSpeed = 5000;
      fadeExponential = 1.024;
      noteElement.innerHTML = `
        <div class="footer-main">EASY MODE activated</div>
        <div class="footer-sub">Press <kbd>SPACE</kbd> to start • Press <kbd>H</kbd> for hard</div>
      `;
      noteElement.style.opacity = 1;
      resetGame();
      return;
    }

    // Arrow keys → queue direction (no 180° turns)
    if (
      event.key == "ArrowLeft" &&
      inputs[inputs.length - 1] != "left" &&
      headDirection() != "right"
    ) {
      inputs.push("left");
      if (!gameStarted) startGame();
      return;
    }
    if (
      event.key == "ArrowUp" &&
      inputs[inputs.length - 1] != "up" &&
      headDirection() != "down"
    ) {
      inputs.push("up");
      if (!gameStarted) startGame();
      return;
    }
    if (
      event.key == "ArrowRight" &&
      inputs[inputs.length - 1] != "right" &&
      headDirection() != "left"
    ) {
      inputs.push("right");
      if (!gameStarted) startGame();
      return;
    }
    if (
      event.key == "ArrowDown" &&
      inputs[inputs.length - 1] != "down" &&
      headDirection() != "up"
    ) {
      inputs.push("down");
      if (!gameStarted) startGame();
      return;
    }
  });



  // =====================================================
  // MOBILE DETECTION + MODALS + SWIPE
  // =====================================================

  const isMobile = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;

  const modeModal = document.getElementById("modeModal");
  const gameOverModal = document.getElementById("gameOverModal");
  const finalScoreEl = document.getElementById("finalScore");
  const gameOverMsgEl = document.getElementById("gameOverMsg");

  function showModeModal() {
    if (!isMobile) return;
    modeModal.classList.remove("hidden");
    gameOverModal.classList.add("hidden");
    document.body.classList.remove("playing");
  }

  function hideModeModal() {
    modeModal.classList.add("hidden");
  }

  function showGameOverModal(message) {
    if (!isMobile) return;
    finalScoreEl.textContent = hardMode ? `Score: H ${score}` : `Score: ${score}`;
    gameOverMsgEl.textContent = message;
    gameOverModal.classList.remove("hidden");
    document.body.classList.remove("playing");
  }

  function hideGameOverModal() {
    gameOverModal.classList.add("hidden");
  }

  // On mobile: show mode selection first
  if (isMobile) {
    showModeModal();
  } else {
    // Desktop: hide modals completely
    if (modeModal) modeModal.classList.add("hidden");
    if (gameOverModal) gameOverModal.classList.add("hidden");
  }

  // Mode buttons
  document.getElementById("easyBtn")?.addEventListener("click", () => {
    hardMode = false;
    fadeSpeed = 5000;
    fadeExponential = 1.024;
    hideModeModal();
    resetGame();
    // Ready to swipe – game starts on first swipe
    noteElement.innerHTML = `<div class="footer-main">Swipe to play</div>`;
    noteElement.style.opacity = 1;
  });

  document.getElementById("hardBtn")?.addEventListener("click", () => {
    hardMode = true;
    fadeSpeed = 4000;
    fadeExponential = 1.025;
    hideModeModal();
    resetGame();
    noteElement.innerHTML = `<div class="footer-main">Swipe to play</div>`;
    noteElement.style.opacity = 1;
  });

  // Play Again → back to mode selection
  document.getElementById("restartModalBtn")?.addEventListener("click", () => {
    hideGameOverModal();
    showModeModal();
    resetGame();
  });

  // Direction handler (shared)
  function handleDirection(dir) {
    if (dir === "left" && inputs[inputs.length - 1] != "left" && headDirection() != "right") {
      inputs.push("left");
      if (!gameStarted) startGame();
    } else if (dir === "up" && inputs[inputs.length - 1] != "up" && headDirection() != "down") {
      inputs.push("up");
      if (!gameStarted) startGame();
    } else if (dir === "right" && inputs[inputs.length - 1] != "right" && headDirection() != "left") {
      inputs.push("right");
      if (!gameStarted) startGame();
    } else if (dir === "down" && inputs[inputs.length - 1] != "down" && headDirection() != "up") {
      inputs.push("down");
      if (!gameStarted) startGame();
    }
  }

  // Swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  const minSwipeDistance = 30;

  document.addEventListener("touchstart", (e) => {
    // Ignore if a modal is open
    if (isMobile && !modeModal.classList.contains("hidden")) return;
    if (isMobile && !gameOverModal.classList.contains("hidden")) return;

    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (isMobile && !modeModal.classList.contains("hidden")) return;
    if (isMobile && !gameOverModal.classList.contains("hidden")) return;
    if (touchStartX === 0 && touchStartY === 0) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < minSwipeDistance) {
      touchStartX = 0;
      touchStartY = 0;
      return;
    }

    if (absDx > absDy) {
      handleDirection(dx > 0 ? "right" : "left");
    } else {
      handleDirection(dy > 0 ? "down" : "up");
    }

    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });

  // Prevent scroll while playing
  document.querySelector(".grid-wrapper")?.addEventListener("touchmove", (e) => {
    if (gameStarted) e.preventDefault();
  }, { passive: false });


  function startGame() {
    gameStarted = true;
    document.body.classList.add("playing");
    noteElement.style.opacity = 0;
    noteElement.innerHTML = "";
    // Hide any lingering modal text
    if (isMobile) {
      hideModeModal();
      hideGameOverModal();
    }
    window.requestAnimationFrame(main);
  }

  function main(timestamp) {
    try {
      if (startTimestamp === undefined) startTimestamp = timestamp;
      const totalElapsedTime = timestamp - startTimestamp;
      const timeElapsedSinceLastCall = timestamp - lastTimestamp;

      const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);
      const percentageOfStep = (totalElapsedTime % speed) / speed;

      // Time for a full step?
      if (stepsTaken != stepsShouldHaveTaken) {
        stepAndTransition(percentageOfStep);

        // Did we eat the apple?
        const headPosition = snakePositions[snakePositions.length - 1];
        if (headPosition == applePosition) {
          score++;
          scoreElement.innerText = hardMode ? `H ${score}` : score;
          addNewApple();
          contrast = Math.min(1, contrast + contrastIncrease);
        }

        stepsTaken++;
      } else {
        // Just animate between steps
        transition(percentageOfStep);
      }

      // Fade the board over time
      if (lastTimestamp) {
        const contrastDecrease =
          timeElapsedSinceLastCall /
          (Math.pow(fadeExponential, score) * fadeSpeed);
        contrast = Math.max(0, contrast - contrastDecrease);
      }

      contrastElement.innerText = `${Math.floor(contrast * 100)}%`;
      containerElement.style.opacity = contrast;

      window.requestAnimationFrame(main);
    } catch (error) {
      // Game over
      document.body.classList.remove("playing");
      gameStarted = false;

      if (isMobile) {
        showGameOverModal(error.message);
      } else {
        const changeMode = hardMode
          ? `Press <kbd>E</kbd> for Easy mode`
          : `Press <kbd>H</kbd> for Hard mode`;
        noteElement.innerHTML = `
          <div class="footer-main" style="color:#ff2a6d;text-shadow:0 0 12px #ff2a6d88;">
            ${error.message}
          </div>
          <div class="footer-sub">
            Press <kbd>SPACE</kbd> to restart • ${changeMode}
          </div>
        `;
        noteElement.style.opacity = 1;
      }
      containerElement.style.opacity = 1;
    }

    lastTimestamp = timestamp;
  }

  function stepAndTransition(percentageOfStep) {
    const newHeadPosition = getNextPosition();
    snakePositions.push(newHeadPosition);

    // Clear old tail (unless we just grew)
    const previousTail = tiles[snakePositions[0]];
    setTile(previousTail);
    previousTail.className = "content"; // remove snake classes

    if (newHeadPosition != applePosition) {
      snakePositions.shift(); // remove old tail

      // Start sliding the new tail out
      const tail = tiles[snakePositions[0]];
      const tailDi = tailDirection();
      const tailValue = `${100 - percentageOfStep * 100}%`;

      tail.classList.add("snake");

      if (tailDi == "right")
        setTile(tail, { left: 0, width: tailValue, "background-color": color });
      if (tailDi == "left")
        setTile(tail, {
          right: 0,
          width: tailValue,
          "background-color": color,
        });
      if (tailDi == "down")
        setTile(tail, { top: 0, height: tailValue, "background-color": color });
      if (tailDi == "up")
        setTile(tail, {
          bottom: 0,
          height: tailValue,
          "background-color": color,
        });
    }

    // Make previous head full size (now body)
    const previousHead = tiles[snakePositions[snakePositions.length - 2]];
    setTile(previousHead, { "background-color": color });
    previousHead.classList.remove("snake-head");
    previousHead.classList.add("snake");

    // Start sliding the new head in
    const head = tiles[newHeadPosition];
    const headDi = headDirection();
    const headValue = `${percentageOfStep * 100}%`;

    head.classList.add("snake", "snake-head");

    if (headDi == "right")
      setTile(head, {
        left: 0,
        width: headValue,
        "background-color": color,
        "border-radius": 0,
      });
    if (headDi == "left")
      setTile(head, {
        right: 0,
        width: headValue,
        "background-color": color,
        "border-radius": 0,
      });
    if (headDi == "down")
      setTile(head, {
        top: 0,
        height: headValue,
        "background-color": color,
        "border-radius": 0,
      });
    if (headDi == "up")
      setTile(head, {
        bottom: 0,
        height: headValue,
        "background-color": color,
        "border-radius": 0,
      });
  }

  function transition(percentageOfStep) {
    // Animate head growing
    const head = tiles[snakePositions[snakePositions.length - 1]];
    const headDi = headDirection();
    const headValue = `${percentageOfStep * 100}%`;
    if (headDi == "right" || headDi == "left") head.style.width = headValue;
    if (headDi == "down" || headDi == "up") head.style.height = headValue;

    // Animate tail shrinking
    const tail = tiles[snakePositions[0]];
    const tailDi = tailDirection();
    const tailValue = `${100 - percentageOfStep * 100}%`;
    if (tailDi == "right" || tailDi == "left") tail.style.width = tailValue;
    if (tailDi == "down" || tailDi == "up") tail.style.height = tailValue;
  }

  function getNextPosition() {
    const headPosition = snakePositions[snakePositions.length - 1];
    const snakeDirection = inputs.shift() || headDirection();

    switch (snakeDirection) {
      case "right": {
        const nextPosition = headPosition + 1;
        if (nextPosition % width == 0) throw Error("The snake hit the wall");
        if (snakePositions.slice(1).includes(nextPosition))
          throw Error("The snake bit itself");
        return nextPosition;
      }
      case "left": {
        const nextPosition = headPosition - 1;
        if (nextPosition % width == width - 1 || nextPosition < 0)
          throw Error("The snake hit the wall");
        if (snakePositions.slice(1).includes(nextPosition))
          throw Error("The snake bit itself");
        return nextPosition;
      }
      case "down": {
        const nextPosition = headPosition + width;
        if (nextPosition > width * height - 1)
          throw Error("The snake hit the wall");
        if (snakePositions.slice(1).includes(nextPosition))
          throw Error("The snake bit itself");
        return nextPosition;
      }
      case "up": {
        const nextPosition = headPosition - width;
        if (nextPosition < 0) throw Error("The snake hit the wall");
        if (snakePositions.slice(1).includes(nextPosition))
          throw Error("The snake bit itself");
        return nextPosition;
      }
    }
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

  function getDirection(first, second) {
    if (first - 1 == second) return "right";
    if (first + 1 == second) return "left";
    if (first - width == second) return "down";
    if (first + width == second) return "up";
    throw Error("the two tile are not connected");
  }

  function addNewApple() {
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * width * height);
    } while (snakePositions.includes(newPosition));

    // Clear old apple class if any
    tiles.forEach((t) => t.classList.remove("apple"));

    const appleTile = tiles[newPosition];
    setTile(appleTile, {
      "background-color": "#ff2a6d",
      "border-radius": "50%",
    });
    appleTile.classList.add("apple");

    applePosition = newPosition;
  }

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
});
