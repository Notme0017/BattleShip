// // ship.test.js
import { Ship } from '../src/ship.js';


describe('Ship', () => {

  describe('constructor', () => {
    test('should create a ship with the correct length', () => {
      const ship = new Ship(3);
      expect(ship.length).toBe(3);
    });

    test('should default hitsTaken to 0', () => {
      const ship = new Ship(3);
      expect(ship.hitsTaken).toBe(0);
    });

    test('should allow hitsTaken to be set manually', () => {
      const ship = new Ship(3, 2);
      expect(ship.hitsTaken).toBe(2);
    });

    test('should the length of ship be less than or equal to 0', () =>{
      expect(() => new Ship(0)).toThrow('Ship size cannot be less than or equal to 0');
    });
  });

  describe('hit()', () => {
    test('should increment hitsTaken by 1', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.hitsTaken).toBe(1);
    });

    test('should increment hitsTaken correctly on multiple hits', () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      expect(ship.hitsTaken).toBe(2);
    });
  });

  describe('isSunk()', () => {
    test('should return false if ship has not been hit', () => {
      const ship = new Ship(3);
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false if hitsTaken is less than length', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true if hitsTaken equals length', () => {
      const ship = new Ship(3);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  });

});


