import { Player } from "./player.js";

export class ComputerPlayer extends Player{
    constructor(playerBoard){
        super(playerBoard);
        this.untriedPositions = [];

        for(let row = 0; row < playerBoard.boardSize; row++){
            for(let col = 0; col < playerBoard.boardSize; col++){
                this.untriedPositions.push([row, col]);
            }
        }

    }

    randomAttack(opponentBoard){
        const min = 0;
        const max = this.untriedPositions.length;
        const lastPostion = this.untriedPositions.length - 1;

        if(max <= min) throw new Error('No more untried positions left');
        const rngValue = Math.floor(Math.random() * (max - min)+ min);

        const attackingPosition = this.untriedPositions[rngValue];

        const row = attackingPosition[0];
        const col = attackingPosition[1];

        if(!(rngValue === lastPostion)){
            [this.untriedPositions[rngValue], this.untriedPositions[lastPostion]] = [this.untriedPositions[lastPostion], this.untriedPositions[rngValue]]
        }

        this.untriedPositions.pop();

        const result = this.attack(opponentBoard, row, col);
        return {...result, row, col};
    }
}