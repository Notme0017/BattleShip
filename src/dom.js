import { Gameboard } from "./gameBoard.js";

let statusTimeout = null;

export function createBoard(gridElement, boardSize = 10){
    const gridObj = document.getElementById(gridElement);
    if(!gridObj) throw new Error('Grid Object not found');
    gridObj.innerHTML = ''
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.id = `${gridElement}-${i}-${j}`;

            gridObj.appendChild(cell);
        }
    }
}

export function renderBoard(board, gridElement, hideShips = false){
    if(!(board instanceof Gameboard)) throw new Error('No existing board to render');
    
    for(let row = 0; row < board.boardSize; row++){
        for(let col = 0; col < board.boardSize; col++){
            const cell = document.getElementById(`${gridElement}-${row}-${col}`);

            if(!cell) continue;

            cell.className = 'cell';
            
            const hasShip = board.containsShip(row, col);
            const isAttacked = board.hasBeenAttacked(row, col);
            
            if(isAttacked){
                if(hasShip)cell.classList.add('hit');
                else cell.classList.add('miss');
            }else if(hasShip && !hideShips){
                cell.classList.add('ship');
            }
        }
    }
}

export function updateCell(board, gridElement, row, col){
    if(!(board instanceof Gameboard)) throw new Error('No existing board to check');

    const cell = document.getElementById(`${gridElement}-${row}-${col}`);
    if(!cell) return;

    if(board.containsShip(row, col)) cell.classList.add('hit');
    else cell.classList.add('miss');
}

export function statusUpdate(message, player = "Player 1"){
    const statusUI = document.getElementById('game-status');
    if(!statusUI) throw new Error('Game Status element not found');
    let text = "";
    if(message === 'already-attacked') text = `${player} - You have already attacked the position.`;
    if(message === 'hit') text = `${player} - Yay! A successful hit. You can go again.`;
    if(message === 'miss') text = `${player} - You missed.`;
    if(message === 'placed-ship')text = `Player - You are placing the ship at invalid postion.`;

    clearTimeout(statusTimeout);

    statusUI.textContent = text;
    statusTimeout = setTimeout(() => {
        statusUI.textContent = '';
    }, 2000);

}

export function showWinDialog(player){
    const winDialog = document.getElementById('win-dialog');
    if(!winDialog) throw new Error('No win dialog found');
    const winText = document.getElementById('win-text');
    if(!winText) throw new Error('No win text element to display');
    winText.textContent = `${player} - won.`;
    winDialog.showModal();
}