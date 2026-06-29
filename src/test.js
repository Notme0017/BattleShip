// ship.test.js
import { Ship } from './ship.js';
import { Gameboard } from './gameBoard.js';

// describe('Ship', () => {

//   describe('constructor', () => {
//     test('should create a ship with the correct length', () => {
//       const ship = new Ship(3);
//       expect(ship.length).toBe(3);
//     });

//     test('should default hitsTaken to 0', () => {
//       const ship = new Ship(3);
//       expect(ship.hitsTaken).toBe(0);
//     });

//     test('should allow hitsTaken to be set manually', () => {
//       const ship = new Ship(3, 2);
//       expect(ship.hitsTaken).toBe(2);
//     });
//   });

//   describe('hit()', () => {
//     test('should increment hitsTaken by 1', () => {
//       const ship = new Ship(3);
//       ship.hit();
//       expect(ship.hitsTaken).toBe(1);
//     });

//     test('should increment hitsTaken correctly on multiple hits', () => {
//       const ship = new Ship(3);
//       ship.hit();
//       ship.hit();
//       expect(ship.hitsTaken).toBe(2);
//     });
//   });

//   describe('isSunk()', () => {
//     test('should return false if ship has not been hit', () => {
//       const ship = new Ship(3);
//       expect(ship.isSunk()).toBe(false);
//     });

//     test('should return false if hitsTaken is less than length', () => {
//       const ship = new Ship(3);
//       ship.hit();
//       expect(ship.isSunk()).toBe(false);
//     });

//     test('should return true if hitsTaken equals length', () => {
//       const ship = new Ship(3);
//       ship.hit();
//       ship.hit();
//       ship.hit();
//       expect(ship.isSunk()).toBe(true);
//     });
//   });

// });

describe('Gameboard', () => {

  let board;
  beforeEach(() => {
    board = new Gameboard();
  });

  describe('constructor', () => {
    test('should create a 10x10 board filled with null', () => {
      expect(board.board.length).toBe(10);
      expect(board.board[0].length).toBe(10);
      expect(board.board[0][0]).toBeNull();
    });

    test('should initialize with no ships', () => {
      expect(board.ships.length).toBe(0);
    });
  });

  describe('placeShip()', () => {
    test('should place a ship instance on the board', () => {
      board.placeShip(3, 0, 0);
      expect(board.board[0][0]).toBeInstanceOf(Ship);
    });

    test('should place ship horizontally across correct cells', () => {
      board.placeShip(3, 0, 0, true);
      expect(board.board[0][0]).toBeInstanceOf(Ship);
      expect(board.board[0][1]).toBeInstanceOf(Ship);
      expect(board.board[0][2]).toBeInstanceOf(Ship);
      expect(board.board[0][3]).toBeNull(); // one past the ship
    });

    test('should place ship vertically across correct cells', () => {
      board.placeShip(3, 0, 0, false);
      expect(board.board[0][0]).toBeInstanceOf(Ship);
      expect(board.board[1][0]).toBeInstanceOf(Ship);
      expect(board.board[2][0]).toBeInstanceOf(Ship);
      expect(board.board[3][0]).toBeNull(); // one past the ship
    });

    test('should add the ship to the ships array', () => {
      board.placeShip(3, 0, 0);
      expect(board.ships.length).toBe(1);
    });

    test('should be able to place multiple ships', () => {
      board.placeShip(3, 0, 0);
      board.placeShip(2, 5, 5);
      expect(board.ships.length).toBe(2);
    });

    test('should throw if horizontal placement goes out of bounds', () => {
      expect(() => board.placeShip(3, 0, 9, true)).toThrow('Placement out of bounds');
    });

    test('should throw if vertical placement goes out of bounds', () => {
      expect(() => board.placeShip(3, 9, 0, false)).toThrow('Placement out of bounds');
    });

    test('should throw if a cell is already occupied', () => {
      board.placeShip(3, 0, 0);
      expect(() => board.placeShip(2, 0, 0)).toThrow('Cell already occupied');
    });
  });

});
