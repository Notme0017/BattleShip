import { Gameboard } from "./gameBoard.js";
import { Player } from "./player.js";
import { ComputerPlayer } from "./computerPlayer.js";
import * as dom from "./dom.js";
import * as helpers from "./helpers.js";
import { placementPhase } from "./placement.js";

export function game(isTwoPlayer = false){
    const boardSize = 10;
    let player1Turn = true;
    let hasGameEnded = false;
    let currentHandler = null;

    const defaultFleet = [4, 3, 2, 1];
    const playerGrid = "player-grid";
    const opponentGrid = "opponent-grid";

    const playerGameBoard = new Gameboard(boardSize);
    const opponentGameBoard = new Gameboard(boardSize);

    const player = new Player(playerGameBoard);
    const opponent = isTwoPlayer? new Player(opponentGameBoard): new ComputerPlayer(opponentGameBoard);

    const playAgainButton = document.getElementById('play-again');
    playAgainButton.addEventListener('click', () =>{
        window.location.reload();
    });

    if(!isTwoPlayer){
        const placementPanel = document.getElementById('placement-panel');
        if(placementPanel) placementPanel.style.display = 'none';

        helpers.randomShipPlacement(playerGameBoard, defaultFleet);
        helpers.randomShipPlacement(opponentGameBoard, defaultFleet);

        dom.createBoard(playerGrid, boardSize);
        dom.createBoard(opponentGrid, boardSize);

        dom.renderBoard(playerGameBoard, playerGrid, false);
        dom.renderBoard(opponentGameBoard, opponentGrid, false);
        console.log(opponentGameBoard.ships.length);

        currentHandler = helpers.setupBoardListener(opponentGrid, gameLoop);

    }else{
        dom.createBoard(playerGrid, boardSize);
        dom.createBoard(opponentGrid, boardSize);

        dom.renderBoard(playerGameBoard, playerGrid, false);
        dom.renderBoard(opponentGameBoard, opponentGrid, false);

        placementPhase(playerGameBoard, playerGrid, defaultFleet, () =>{
            dom.renderBoard(playerGameBoard, playerGrid, true);
            showPassScreen("Player 2, time to place your ships", () =>{
                placementPhase(opponentGameBoard, opponentGrid, defaultFleet, () =>{
                    dom.renderBoard(opponentGameBoard, opponentGrid, true);
                    showPassScreen("Player 1, you go first", () =>{
                        const placementPanel = document.getElementById('placement-panel');
                        if(placementPanel) placementPanel.style.display = 'none';
                        currentHandler = helpers.setupBoardListener(opponentGrid, gameLoop);
                    });
                })
            })
        })

    }


    function gameLoop(row, col){
        if(!isTwoPlayer){
            const playerAttackedData = player.attack(opponentGameBoard, row, col);
            console.log(playerAttackedData);
            console.log(opponentGameBoard.ships.length);
            dom.updateCell(opponentGameBoard, opponentGrid, row, col);
            dom.statusUpdate(playerAttackedData.result, "Player");
            if(opponentGameBoard.allShipsSunk()){
                dom.showWinDialog("Player");
                return;
            }
            if(!playerAttackedData.keepTurn){
                while(true){
                    const computerAttackedData = opponent.randomAttack(playerGameBoard);
                    dom.updateCell(playerGameBoard, playerGrid, computerAttackedData.row, computerAttackedData.col);
                    dom.statusUpdate(computerAttackedData.result, "Computer");
                    if(playerGameBoard.allShipsSunk()) {
                        dom.showWinDialog("Computer");
                        return;
                    }
                    if(!computerAttackedData.keepTurn)break;
                }
            }
        }
        else{
            const currentAttacker = player1Turn? player: opponent;
            const attackedBoard = player1Turn? opponentGameBoard: playerGameBoard;
            const defendedBoard = player1Turn? playerGameBoard: opponentGameBoard;
            const attackedGrid = player1Turn? opponentGrid: playerGrid;
            const defendedGrid = player1Turn? playerGrid: opponentGrid;
            const attackerName = player1Turn? "Player 1": "Player 2";
            const nextAttacker = player1Turn? "Player 2": "Player 1";

            const attackedData = currentAttacker.attack(attackedBoard, row, col);
            dom.updateCell(attackedBoard, attackedGrid, row, col);
            dom.statusUpdate(attackedData.result, attackerName);

            if(attackedBoard.allShipsSunk()){
                dom.showWinDialog(attackerName);
                return;
            }

            if(!attackedData.keepTurn){
                showPassScreen(`${nextAttacker} your turn`, () =>{
                    helpers.removeBoardListener(attackedGrid, currentHandler);
                    currentHandler = helpers.setupBoardListener(defendedGrid, gameLoop);
                    player1Turn = !player1Turn;
                });
            }
        }
    }

    function showPassScreen(message, onReady){
    const passScreen = document.getElementById('pass-screen');
    const passText = document.getElementById('pass-text');
    const readyBtn = document.getElementById('ready-btn');

    if(!passScreen) throw new Error('No pass screen available');
    if(!passText) throw new Error(' No pass text avaialable');
    if(!readyBtn) throw new Error('No ready button found');

    passText.textContent = message;
    passScreen.showModal();
    readyBtn.addEventListener('click', () =>{
        passScreen.close();
        onReady();
    }, {once: true});
}
}