import { Gameboard } from "./gameBoard.js";

export class Player{
    constructor(ownGameBoard){
        this.ownGameBoard = ownGameBoard;
    }

    attack(opponentBoard, row, column){
        //false when need to change turn
        //true keeping the turn
        if(!(opponentBoard instanceof Gameboard)) throw new Error('Gameboard not provided');
        const value = opponentBoard.receiveAttack(row, column);
        if(value === 'already-attacked') return true;
        else if(value === 'hit') return true;
        else return false;
    }
}