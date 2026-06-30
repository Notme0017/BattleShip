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

  describe('receiveAttack()', () => {
    test('should throw if row is out of bounds', () => {
      expect(() => board.receiveAttack(10, 5)).toThrow('Invalid attack position');
    });

    test('should throw if column is out of bounds', () => {
      expect(() => board.receiveAttack(5, 10)).toThrow('Invalid attack position');
    });

    test('should return true for a valid attack on an empty cell', () => {
      expect(board.receiveAttack(0, 0)).toBe(true);
    });

    test('should return true for a valid attack on a ship', () => {
      board.placeShip(3, 0, 0);
      expect(board.receiveAttack(0, 0)).toBe(true);
    });

    test('should call hit() on the ship when attacked', () => {
      const ship = board.placeShip(3, 0, 0);
      board.receiveAttack(0, 0);
      expect(ship.hitsTaken).toBe(1);
    });

    test('should not call hit() when attacking an empty cell', () => {
      board.placeShip(3, 0, 0);
      const ship = board.ships[0];
      board.receiveAttack(5, 5); // empty cell, away from ship
      expect(ship.hitsTaken).toBe(0);
    });

    test('should return false when attacking the same cell twice', () => {
      board.receiveAttack(0, 0);
      expect(board.receiveAttack(0, 0)).toBe(false);
    });

    test('should not call hit() again when attacking an already-hit ship cell', () => {
      const ship = board.placeShip(3, 0, 0);
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 0); // repeat attack
      expect(ship.hitsTaken).toBe(1); // still only 1, not 2
    });

    test('should correctly distinguish between different coordinates on larger boards', () => {
      const largeBoard = new Gameboard(12);
      expect(largeBoard.receiveAttack(1, 11)).toBe(true);
      expect(largeBoard.receiveAttack(11, 1)).toBe(true); // should not collide with above
    });
  });

  describe('allShipsSunk()', () => {
    test('should return true when no ships have been placed', () => {
      expect(board.allShipsSunk()).toBe(true);
    });

    test('should return false when ships are placed but not hit', () => {
      board.placeShip(3, 0, 0);
      expect(board.allShipsSunk()).toBe(false);
    });

    test('should return false when some ships are sunk but not all', () => {
      board.placeShip(1, 0, 0); // sinks in 1 hit
      board.placeShip(2, 5, 5); // needs 2 hits
      board.receiveAttack(0, 0); // sinks first ship
      expect(board.allShipsSunk()).toBe(false);
    });

    test('should return true when all ships are sunk', () => {
      board.placeShip(1, 0, 0);
      board.placeShip(1, 5, 5);
      board.receiveAttack(0, 0);
      board.receiveAttack(5, 5);
      expect(board.allShipsSunk()).toBe(true);
    });
  });

});

