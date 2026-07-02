import {Player} from '../src/player.js';
import { Gameboard } from '../src/gameBoard.js';

describe('Player', () => {

  let player;
  let opponentBoard;

  beforeEach(() => {
    player = new Player();
    opponentBoard = new Gameboard();
  });

  describe('attack()', () => {
    test('should throw if opponentBoard is not a Gameboard instance', () => {
      expect(() => player.attack({}, 0, 0)).toThrow('Gameboard not provided');
    });

    test('should return true when attack results in a hit', () => {
      opponentBoard.placeShip(3, 0, 0);
      expect(player.attack(opponentBoard, 0, 0).keepTurn).toBe(true);
    });

    test('should return false when attack results in a miss', () => {
      expect(player.attack(opponentBoard, 0, 0).keepTurn).toBe(false);
    });

    test('should return true when attacking an already-attacked cell', () => {
      player.attack(opponentBoard, 0, 0); // first attack, a miss
      expect(player.attack(opponentBoard, 0, 0).keepTurn).toBe(true); // repeat
    });

    test('should actually call hit() on the ship via the board', () => {
      const ship = opponentBoard.placeShip(3, 0, 0);
      player.attack(opponentBoard, 0, 0);
      expect(ship.hitsTaken).toBe(1);
    });

  });

});