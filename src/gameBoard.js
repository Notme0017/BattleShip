import { Ship } from "./ship.js";

export class Gameboard{
    constructor(boardSize = 10){
        this.boardSize = boardSize;
        this.board = Array(this.boardSize).fill(null).map(() => Array(boardSize).fill(null));
        this.ships = [];
        this.attacks = new Set();
    }

    placeShip(length, row, column, isHorizontal = true){
        if(length <= 0 ) throw new Error('Ship length must be greater than 0');
        if(isHorizontal && column + length > this.boardSize) throw new Error('Placement out of bounds');
        if(!isHorizontal && row + length > this.boardSize) throw new Error('Placement out of bounds');

        for(let i = 0; i < length; i++){
            const c = isHorizontal? column + i: column;
            const r = isHorizontal? row: row + i;
            if(this.board[r][c] !== null) throw new Error('Cell already occupied');
        }

        const ship = new Ship(length);
        this.ships.push(ship);

        for(let i = 0; i < length; i++){
            const c = isHorizontal? column + i: column;
            const r = isHorizontal? row : row + i;
            this.board[r][c] = ship;
        }

    }

    receiveAttack(row, col){
        if(row >= this.boardSize || col >= this.boardSize)throw new Error('Invalid attack position');
        const attackedCoordinates = `${row}-${col}`;
        if(this.attacks.has(attackedCoordinates)) return 'already-attacked';
        this.attacks.add(attackedCoordinates);
        if(this.containsShip(row, col)){
            this.board[row][col].hit();
            return 'hit';
        }
        return 'miss';
    }

    allShipsSunk(){
        return this.ships.every(ship => ship.isSunk())
    }
    
    containsShip(row, col){
        if(row >= this.boardSize || col >= this.boardSize)throw new Error('Invalid position');
        return this.board[row][col] instanceof Ship;
    }

    hasBeenAttacked(row, col){
        if(row >= this.boardSize || col >= this.boardSize)throw new Error('Invalid position');
        const attackedCoordinates = `${row}-${col}`;
        return this.attacks.has(attackedCoordinates);
    }
}