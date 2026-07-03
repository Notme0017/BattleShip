import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";

export function setupBoardListener(gridElement, callback){
    const gridObj = document.getElementById(gridElement);
    if(!gridObj) throw new Error('Grid not found');
    function handler(e){
        if(!e.target.classList.contains('cell'))return;
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        callback(row, col);
    };
    gridObj.addEventListener('click', handler);
    return handler;
};

export function removeBoardListener(gridElement, handler){
    const gridObj = document.getElementById(gridElement);
    if(!gridObj) throw new Error('Grid not found');
    gridObj.removeEventListener('click', handler);
}

export function randomShipPlacement(board, fleet=[4, 3, 2, 1]){
    if(!(board instanceof Gameboard)) throw new Error('No board found');
    const copyFleet = [...fleet];

    while(copyFleet.length > 0){
        const min = 0;
        const max = board.boardSize;
        const rngRow = Math.floor(Math.random() * (max - min)+ min);
        const rngCol = Math.floor(Math.random() * (max - min) + min);

        const minFleet = 0;
        const maxFleet = copyFleet.length;
        const randomShip = Math.floor(Math.random() * (maxFleet - minFleet) + minFleet);

        const rngHorizontal = Math.floor(Math.random() * 2);

        try{
            board.placeShip(copyFleet[randomShip], rngRow, rngCol, rngHorizontal === 1);
            [copyFleet[randomShip], copyFleet[copyFleet.length - 1]] = [copyFleet[copyFleet.length - 1], copyFleet[randomShip]];
            copyFleet.pop();
        }
        catch(e){
            console.log("Unable to place ship");
        }
    }
}

    