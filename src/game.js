import { Gameboard } from "./gameBoard.js";
import { Player } from "./player.js";
import { ComputerPlayer } from "./computerPlayer.js";
import * as dom from "./dom.js";
import * as helpers from "./helpers.js";

import './style.css';

const boardSize = 10;

const playerGrid = "player-grid";
const opponentGrid = "opponent-grid";

const playerGameBoard = new Gameboard(boardSize);
const opponentGameBoard = new Gameboard(boardSize);

const player = new Player(playerGameBoard);
const opponent = new ComputerPlayer(opponentGameBoard);

helpers.randomShipPlacement(playerGameBoard);
helpers.randomShipPlacement(opponentGameBoard);

dom.createBoard(playerGrid, boardSize);
dom.createBoard(opponentGrid, boardSize);

dom.renderBoard(playerGameBoard, playerGrid, false);
dom.renderBoard(opponentGameBoard, opponentGrid, true);

const playAgainButton = document.getElementById('play-again');
playAgainButton.addEventListener('click', () =>{
    window.location.reload();
});

helpers.setupBoardListener(opponentGrid, game);

function game(row, col){
    const playerObj = player.attack(opponentGameBoard, row, col);
    dom.updateCell(opponentGameBoard, opponentGrid, row, col);
    dom.statusUpdate(playerObj.result, "Player");
    if(opponentGameBoard.allShipsSunk()){
        dom.showWinDialog("Player");
        return;
    } 
    if(!playerObj.keepTurn){
        while(true){
            const opponentObj = opponent.randomAttack(playerGameBoard);
            dom.updateCell(playerGameBoard, playerGrid, opponentObj.row, opponentObj.col);
            dom.statusUpdate(opponentObj.result, "Computer");
            if(playerGameBoard.allShipsSunk()){
                dom.showWinDialog("Computer");
                return;
            }
            if(!opponentObj.keepTurn)break;
        }
        
    }
}