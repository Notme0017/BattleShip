import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";

export function setupBoardListener(gridElement, callback){
    const gridObj = document.getElementById(gridElement);
    if(!gridObj) throw new Error('Grid not found');
    gridObj.addEventListener('click', (e) =>{
        if(!e.target.classList.contains('cell'))return;
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        callback(row, col);
    })
};

export function randomShipPlacement(board, fleet=[4, 3, 2, 1]){
    if(!(board instanceof Gameboard)) throw new Error('No board found');

    while(fleet.length > 0){
        const min = 0;
        const max = board.boardSize;
        const rngRow = Math.floor(Math.random() * (max - min)+ min);
        const rngCol = Math.floor(Math.random() * (max - min) + min);

        const minFleet = 0;
        const maxFleet = fleet.length;
        const randomShip = Math.floor(Math.random() * (maxFleet - minFleet) + minFleet);

        const rngHorizontal = Math.floor(Math.random() * 2);

        try{
            board.placeShip(fleet[randomShip], rngRow, rngCol, rngHorizontal === 1);
            [fleet[randomShip], fleet[fleet.length - 1]] = [fleet[fleet.length - 1], fleet[randomShip]];
            fleet.pop();
        }
        catch(e){

        }
    }
}

    