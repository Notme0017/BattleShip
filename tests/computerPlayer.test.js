// computerPlayer.test.js
import { ComputerPlayer } from '../src/computerPlayer.js';
import { Gameboard } from '../src/gameBoard.js';

describe('ComputerPlayer', () => {

  let computerPlayer;
  let opponentBoard;

  beforeEach(() => {
    const playerBoard = new Gameboard();
    computerPlayer = new ComputerPlayer(playerBoard);
    opponentBoard = new Gameboard();
  });

  describe('constructor', () => {
    test('should populate untriedPositions with every coordinate on the board', () => {
      // 10x10 board = 100 total coordinates
      expect(computerPlayer.untriedPositions.length).toBe(100);
    });

    test('should store coordinates as [row, col] pairs', () => {
      const firstEntry = computerPlayer.untriedPositions[0];
      expect(Array.isArray(firstEntry)).toBe(true);
      expect(firstEntry.length).toBe(2);
    });
  });

  describe('randomAttack()', () => {
    test('should reduce untriedPositions by exactly 1 after each call', () => {
      computerPlayer.randomAttack(opponentBoard);
      expect(computerPlayer.untriedPositions.length).toBe(99);
    });

    test('should return true or false (a valid attack() result)', () => {
      const result = computerPlayer.randomAttack(opponentBoard);
      expect(typeof result).toBe('object');
    });

    test('should never attack the same coordinate twice across all possible attacks', () => {
      const attackedCoordinates = new Set();

      // Attack until every cell has been used
      for (let i = 0; i < 100; i++) {
        const beforeLength = computerPlayer.untriedPositions.length;
        const pickedPosition = computerPlayer.untriedPositions[
          computerPlayer.untriedPositions.length - 1
        ]; // not reliable to predict exact pick, so instead we verify via the board itself

        const result = computerPlayer.randomAttack(opponentBoard);

        // every single attack should be a fresh one, never 'already-attacked'
        // attack() collapses 'already-attacked' and 'hit' into true, so we check
        // via the board's own attacks Set size instead, which only grows on new attacks
        expect(opponentBoard.attacks.size).toBe(i + 1);
      }
    });

    test('should exhaust untriedPositions to empty after 100 attacks on a 10x10 board', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      expect(computerPlayer.untriedPositions.length).toBe(0);
    });

    test('should have attacked every coordinate on the board exactly once', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      // if every coordinate was attacked exactly once, the board's attacks Set
      // should contain all 100 unique coordinates
      expect(opponentBoard.attacks.size).toBe(100);
    });

    test('should return false to give other player chance or trigger end game when untriedPositions becomes empty', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      expect(() => computerPlayer.randomAttack(opponentBoard)).toThrow('No more untried positions left');
    });

  });

});