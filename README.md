# Neon Snake

<div align="center">
    <img src="preview.png" alt="Project Banner" width='1918' height='948' >
</div>

A modern, visually intense Snake game built with pure HTML, CSS, and vanilla JavaScript.

![Neon Snake](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-success)

---

## Live Demo

[Click here](https://souravbanerjeedata.github.io/snake-game-in-javascript/)

---

## Features

- **Smooth sliding animations** — Snake head and tail glide between tiles instead of jumping
- **Contrast fading mechanic** — The board slowly fades; eating apples restores visibility
- **Hard Mode** — Faster fade for a real challenge
- **Neon visual design** — Glowing snake, pulsing apple, animated background, glassmorphism UI
- **Responsive layout** — Works on desktop and mobile
- **Clean keyboard controls**

---

## How to Play

| Key             | Action                            |
| --------------- | --------------------------------- |
| `←` `↑` `→` `↓` | Change direction / Start the game |
| `Space`         | Restart the game                  |
| `H`             | Switch to **Hard** mode           |
| `E`             | Switch to **Easy** mode           |

**Goal:** Eat as many apples as possible without hitting the walls or yourself.

The board gradually loses contrast (becomes transparent). Eating an apple restores some visibility. In Hard mode the fade is much more aggressive.

---

## Technical Highlights

- 15×15 grid generated dynamically with JavaScript
- `requestAnimationFrame` game loop with precise step timing
- CSS-driven head/tail transitions for fluid movement
- Collision detection for walls and self-collision
- Input queue that prevents 180° turns
- Progressive difficulty via the contrast system

---

## Controls Summary

- **Arrow Keys** → Move the snake
- **Space** → Restart
- **H** → Hard mode
- **E** → Easy mode

---

## Author

**Sourav Banerjee**

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy the glow!
