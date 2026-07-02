import { Gameboard } from "./gameBoard.js";

export class Player{
    constructor(ownGameBoard){
        this.ownGameBoard = ownGameBoard;
    }

    attack(opponentBoard, row, column){
        if(!(opponentBoard instanceof Gameboard)) throw new Error('Gameboard not provided');
        const value = opponentBoard.receiveAttack(row, column);
        if(value === 'already-attacked') return {keepTurn: true, result: "already-attacked"};
        else if(value === 'hit') return {keepTurn: true, result: "hit"};
        else return {keepTurn: false, result: "miss"};
    }
}