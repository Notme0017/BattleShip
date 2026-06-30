// game.test.js
import { Gameboard } from '../src/gameBoard.js';
import { ComputerPlayer } from '../src/computerPlayer.js';

describe('Full game simulation', () => {

  test('a complete game between two ComputerPlayers terminates with exactly one winner', () => {
    const NUM_SIMULATIONS = 50;

    for(let sim = 0; sim < NUM_SIMULATIONS; sim++){
        const board1 = new Gameboard();
        const board2 = new Gameboard();

        // place a small known fleet on each board
        board1.placeShip(3, 0, 0);
        board1.placeShip(2, 5, 5);

        board2.placeShip(3, 0, 0);
        board2.placeShip(2, 5, 5);

        const player1 = new ComputerPlayer(board1);
        const player2 = new ComputerPlayer(board2);

        let player1Turn = true;
        let turnsTaken = 0;
        const maxTurns = 10000; // safety net in case of an infinite loop bug

        while (!board1.allShipsSunk() && !board2.allShipsSunk()) {
        if (turnsTaken >= maxTurns) {
            throw new Error('Game did not terminate within expected turns, possible infinite loop');
        }

        let attackResult;
        if (player1Turn) {
            attackResult = player1.randomAttack(board2);
        } else {
            attackResult = player2.randomAttack(board1);
        }

        if (attackResult === false) {
            player1Turn = !player1Turn;
        }

        turnsTaken++;
        }

        // exactly one board should have all ships sunk, not both, not neither
        const board1Sunk = board1.allShipsSunk();
        const board2Sunk = board2.allShipsSunk();

        expect(board1Sunk !== board2Sunk).toBe(true); // exactly one is true (XOR)
        expect(turnsTaken).toBeLessThan(maxTurns); // confirms it terminated naturally, not via the safety net
    }
    
  });

});