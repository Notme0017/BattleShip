import { Player } from "./player.js";
import { Gameboard } from "./gameBoard.js";

export class ComputerPlayer extends Player{
    constructor(playerBoard){
        super(playerBoard);
        this.untriedPositions = [];

        for(let row = 0; row < playerBoard.boardSize; row++){
            for(let col = 0; col < playerBoard.boardSize; col++){
                this.untriedPositions.push([row, col]);
            }
        }

        this.priorityTargets = [];
    }

    randomAttack(opponentBoard){
        if(this.untriedPositions.length === 0 && this.priorityTargets.length === 0) throw new Error('No positions left to attack');

        let row, col;

        if(this.priorityTargets.length > 0){
            [row, col] = this.priorityTargets.shift();

            const key = `${row}-${col}`;
            const indexInUntried = this.untriedPositions.findIndex(
                pos => `${pos[0]}-${pos[1]}` === key
            );
            if(indexInUntried !== - 1) this.untriedPositions.splice(indexInUntried, 1);
        }else{
            const rngIndex = Math.floor(Math.random() * this.untriedPositions.length);
            [row, col] = this.untriedPositions[rngIndex];
            [this.untriedPositions[rngIndex], this.untriedPositions[this.untriedPositions.length - 1]] = [this.untriedPositions[this.untriedPositions.length - 1], this.untriedPositions[rngIndex]];
            this.untriedPositions.pop();
        }

        const result = this.attack(opponentBoard, row, col);

        if(result.result === 'hit'){
            const hitShip = opponentBoard.board[row][col];
            if(hitShip.isSunk()){
                this.priorityTargets = [];
            }else{
                const neighbours = [
                    [row - 1, col],
                    [row + 1, col],
                    [row, col + 1],
                    [row, col - 1]
                ];
                neighbours.forEach(([r, c]) => {
                    if(r < 0 || r >= opponentBoard.boardSize) return;
                    if(c < 0 || c >= opponentBoard.boardSize) return;
                    if(opponentBoard.hasBeenAttacked(r, c))return;
                    const key = `${r}-${c}`;
                    const alreadyTargeted = this.priorityTargets.some(
                        pos => `${pos[0]}-${pos[1]}` === key
                    );
                    if(!alreadyTargeted) this.priorityTargets.unshift([r, c]);
                });
            }
        }
        return {...result, row, col};
    }
}