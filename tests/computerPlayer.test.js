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
      expect(computerPlayer.untriedPositions.length).toBe(100);
    });

    test('should store coordinates as [row, col] pairs', () => {
      const firstEntry = computerPlayer.untriedPositions[0];
      expect(Array.isArray(firstEntry)).toBe(true);
      expect(firstEntry.length).toBe(2);
    });

    test('should initialize priorityTargets as empty array', () => {
      expect(computerPlayer.priorityTargets).toEqual([]);
    });
  });

  describe('randomAttack() - hunting mode', () => {
    test('should reduce untriedPositions by exactly 1 after each call', () => {
      computerPlayer.randomAttack(opponentBoard);
      expect(computerPlayer.untriedPositions.length).toBe(99);
    });

    test('should return an object with keepTurn, result, row and col', () => {
      const result = computerPlayer.randomAttack(opponentBoard);
      expect(result).toHaveProperty('keepTurn');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('row');
      expect(result).toHaveProperty('col');
    });

    test('should never attack the same coordinate twice across all possible attacks', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
        expect(opponentBoard.attacks.size).toBe(i + 1);
      }
    });

    test('should exhaust untriedPositions to empty after 100 attacks', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      expect(computerPlayer.untriedPositions.length).toBe(0);
    });

    test('should have attacked every coordinate exactly once after 100 attacks', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      expect(opponentBoard.attacks.size).toBe(100);
    });

    test('should throw when called after all positions are exhausted', () => {
      for (let i = 0; i < 100; i++) {
        computerPlayer.randomAttack(opponentBoard);
      }
      expect(() => computerPlayer.randomAttack(opponentBoard)).toThrow('No positions left to attack');
    });
  });

  describe('randomAttack() - targeting mode', () => {
    test('should add adjacent cells to priorityTargets after a hit', () => {
      opponentBoard.placeShip(3, 5, 5, true);
      
      computerPlayer.untriedPositions = [[5, 5]];

      computerPlayer.randomAttack(opponentBoard);
      expect(computerPlayer.priorityTargets.length).toBeGreaterThan(0);
    });

    test('should pick from priorityTargets when in targeting mode', () => {
      opponentBoard.placeShip(3, 5, 5, true);
      computerPlayer.priorityTargets = [[5, 5]];

      // remove from untriedPositions to simulate proper state
      const idx = computerPlayer.untriedPositions.findIndex(
        pos => `${pos[0]}-${pos[1]}` === '5-5'
      );
      computerPlayer.untriedPositions.splice(idx, 1);

      const result = computerPlayer.randomAttack(opponentBoard);
      expect(result.row).toBe(5);
      expect(result.col).toBe(5);
    });

    test('should clear priorityTargets after sinking a ship', () => {
      opponentBoard.placeShip(1, 5, 5);
      computerPlayer.priorityTargets = [[5, 5]];

      const idx = computerPlayer.untriedPositions.findIndex(
        pos => `${pos[0]}-${pos[1]}` === '5-5'
      );
      computerPlayer.untriedPositions.splice(idx, 1);

      computerPlayer.randomAttack(opponentBoard);
      expect(computerPlayer.priorityTargets.length).toBe(0);
    });

    test('should not add already-attacked cells to priorityTargets', () => {
      opponentBoard.placeShip(3, 0, 0, true);
      
      // pre-attack some adjacent cells
      opponentBoard.receiveAttack(0, 1);
      opponentBoard.receiveAttack(1, 0);

      computerPlayer.priorityTargets = [[0, 0]];
      const idx = computerPlayer.untriedPositions.findIndex(
        pos => `${pos[0]}-${pos[1]}` === '0-0'
      );
      computerPlayer.untriedPositions.splice(idx, 1);

      computerPlayer.randomAttack(opponentBoard);

      const hasAlreadyAttacked = computerPlayer.priorityTargets.some(([r, c]) =>
        opponentBoard.hasBeenAttacked(r, c)
      );
      expect(hasAlreadyAttacked).toBe(false);
    });

    test('should not add out-of-bounds cells to priorityTargets', () => {
      opponentBoard.placeShip(1, 0, 0);
      computerPlayer.priorityTargets = [[0, 0]];

      const idx = computerPlayer.untriedPositions.findIndex(
        pos => `${pos[0]}-${pos[1]}` === '0-0'
      );
      computerPlayer.untriedPositions.splice(idx, 1);

      computerPlayer.randomAttack(opponentBoard);

      const hasOutOfBounds = computerPlayer.priorityTargets.some(
        ([r, c]) => r < 0 || r >= 10 || c < 0 || c >= 10
      );
      expect(hasOutOfBounds).toBe(false);
    });

    test('should not add duplicate cells to priorityTargets', () => {
      opponentBoard.placeShip(3, 5, 5, true);
      computerPlayer.priorityTargets = [[5, 6]]; // already a neighbour of 5,5

      const idx = computerPlayer.untriedPositions.findIndex(
        pos => `${pos[0]}-${pos[1]}` === '5-5'
      );
      computerPlayer.untriedPositions.splice(idx, 1);
      computerPlayer.priorityTargets.unshift([5, 5]);

      computerPlayer.randomAttack(opponentBoard);

      const occurrences = computerPlayer.priorityTargets.filter(
        ([r, c]) => r === 5 && c === 6
      ).length;
      expect(occurrences).toBeLessThanOrEqual(1);
    });

    test('should remove picked priorityTarget from untriedPositions', () => {
      opponentBoard.placeShip(3, 5, 5, true);
      computerPlayer.priorityTargets = [[5, 5]];

      const beforeLength = computerPlayer.untriedPositions.length;
      computerPlayer.randomAttack(opponentBoard);

      const stillInUntried = computerPlayer.untriedPositions.some(
        ([r, c]) => r === 5 && c === 5
      );
      expect(stillInUntried).toBe(false);
    });
  });

});