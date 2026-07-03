# Battleship

A fully featured browser-based Battleship game built with vanilla JavaScript using a test-driven development approach.

**GitHub:** https://github.com/Notme0017/BattleShip

---

## Features

- **Two game modes** — play against a smart computer opponent or challenge a friend on the same screen
- **Manual ship placement** — select ships, choose orientation, place on your board, and undo if you change your mind
- **Smart computer AI** — the computer hunts adjacent cells after a hit rather than attacking randomly, and returns to random mode once a ship is sunk
- **Turn management** — hit and sunk ships grant an extra turn, misses switch the turn
- **Pass screen handoff** — in two-player mode a pass screen hides ship positions between turns so neither player can cheat
- **Hit/Miss/Sunk feedback** — every attack is announced at the bottom of the screen
- **Win detection** — game ends immediately when all of one player's ships are sunk

---

## How to Play

1. Select a game mode on the start screen
2. Place your ships on your board by selecting a ship from the panel, choosing horizontal or vertical orientation, and clicking a cell
3. Press **Done** when all ships are placed (in two-player mode, pass the screen to your opponent to do the same)
4. Click cells on the opponent's board to attack
5. Hit a ship and you get another turn — miss and the turn switches
6. Sink all of the opponent's ships to win

---

## Technical Highlights

- **Test-driven development throughout** — every class was built test-first using Jest, with 60+ tests covering unit behavior, edge cases, and a full game integration simulation
- **Clean separation of concerns** — `Ship`, `Gameboard`, `Player`, and `ComputerPlayer` each have a single responsibility with no knowledge of the layers above them
- **Event-driven game loop** — the game loop is entirely event-driven rather than a blocking `while` loop, keeping the browser responsive and making turn delays straightforward to add
- **Smart AI targeting** — after a hit the computer builds a priority queue of adjacent cells and exhausts them before returning to random hunting, using only information a human player would also have (hit/miss/sunk feedback)
- **Defensive state management** — all shared state is managed via closures, fleet arrays are defensively copied at every boundary, and event listeners are explicitly named and removed to prevent stacking across game phases

---

## Running Tests

```bash
npm install
npm test
```

Tests are written with Jest and Babel. The test suite covers:
- `Ship` — construction, hit tracking, sunk detection
- `Gameboard` — ship placement, attack resolution, boundary conditions, ship removal
- `Player` — attack delegation and turn-keeping logic
- `ComputerPlayer` — random attack exhaustion, targeting mode, priority queue behavior
- Integration — full simulated games between two computer players repeated 50 times

---

## Technologies Used

- Vanilla JavaScript (ES6 modules)
- Webpack 5 with webpack-dev-server
- Babel (for Jest ES module support)
- Jest (unit and integration testing)
- HTML5 / CSS3
- HTML `dialog` element for modals
