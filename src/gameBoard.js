import { Ship } from "./ship.js";

export class Gameboard{
    constructor(boardSize = 10){
        this.boardSize = boardSize;
        this.board = Array(this.boardSize).fill(null).map(() => Array(boardSize).fill(null));
        this.ships = [];
        this.attacks = new Set();
    }

    placeShip(length, row, column, isHorizontal = true){

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

        return ship;
    }

    receiveAttack(row, column){
        if(row >= this.boardSize || column >= this.boardSize)throw new Error('Invalid attack position');
        const attackedCoordinates = `${row}-${column}`;
        if(this.attacks.has(attackedCoordinates)) return false;
        if(this.board[row][column] instanceof Ship){
            this.board[row][column].hit();
        }
        this.attacks.add(attackedCoordinates);
        return true;
    }

    allShipsSunk(){
        return this.ships.every(ship => ship.isSunk())
    }
}