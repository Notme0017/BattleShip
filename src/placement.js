import { Gameboard } from "./gameBoard.js";
import * as dom from "./dom.js";

export function placementPhase(board, gridElement, fleet, onComplete){
    const remainingFleet = [...fleet];
    let selectedElement = null;
    let selectedLength = null;
    let isHorizontal = true;
    let lastPlacement = [];

    const shipList = document.getElementById('ship-list');
    const orientationToggle = document.getElementById('orientation-toggle');
    const undoButton = document.getElementById('undo-btn');
    const doneButton = document.getElementById('done-btn');
    const gridContainer = document.getElementById(gridElement);

    if(!shipList) throw new Error('No ship list found');
    if(!orientationToggle) throw new Error('No orientation switch found');
    if(!undoButton)throw new Error('No undo button found');
    if(!doneButton) throw new Error('No done button found');
    if(!gridContainer)throw new Error('No grid to place ships');

    shipList.innerHTML = '';
    remainingFleet.forEach((ship, index) => {
        const shipContainer = document.createElement('li');
        shipContainer.textContent = `Ship-${ship}`;
        shipContainer.dataset.length = ship;
        shipContainer.dataset.index = index;
        shipList.appendChild(shipContainer);
    });

    shipList.addEventListener('click', handleShipList);

    function handleShipList(e){
        if(e.target.tagName !== "LI") return;
        if(e.target.classList.contains('placed'))return;
        const previouslySelected = shipList.querySelector('.selected');
        if(previouslySelected) previouslySelected.classList.remove('selected');
        e.target.classList.add('selected');
        selectedElement = e.target;
        selectedLength = parseInt(e.target.dataset.length);
    }

    orientationToggle.addEventListener('click', handleOrientation);

    function handleOrientation(){
        isHorizontal = !isHorizontal;
        if(isHorizontal)orientationToggle.textContent = 'Change Vertical';
        else orientationToggle.textContent = 'Change Horizontal';
    }

    undoButton.addEventListener('click', handleUndo);

    function handleUndo(){
        const lastPlacedShip = lastPlacement.pop();
        board.removeShip(lastPlacedShip.length, lastPlacedShip.row, lastPlacedShip.col, lastPlacedShip.isHorizontal);
        
        remainingFleet.push(lastPlacedShip.length);
        
        dom.renderBoard(board, gridElement, false);
        const placedClass = shipList.querySelector(`[data-index="${lastPlacedShip.index}"]`);
        if(placedClass.classList.contains('placed'))placedClass.classList.remove('placed');
        
        const previouslySelected = shipList.querySelector('.selected');
        if(previouslySelected)previouslySelected.classList.remove('selected');
        
        selectedElement= null;
        selectedLength = null;
        
        undoButton.disabled = lastPlacement.length === 0;
        doneButton.disabled = true;
    }

    doneButton.addEventListener('click', handleDone);

    function handleDone(){
        gridContainer.removeEventListener('click', handlePlacement);
        orientationToggle.removeEventListener('click', handleOrientation);
        shipList.removeEventListener('click', handleShipList);
        undoButton.removeEventListener('click', handleUndo);
        doneButton.removeEventListener('click', handleDone);
        onComplete();
    }

    function handlePlacement(e){
        if(!e.target.classList.contains('cell'))return;
        if(selectedLength === null)return;

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        try{
            board.placeShip(selectedLength, row, col, isHorizontal);
            lastPlacement.push({length: selectedLength, row : row, col: col, isHorizontal: isHorizontal, index: parseInt(selectedElement.dataset.index)});
            selectedElement.classList.add('placed');
            const fleetIndex = remainingFleet.indexOf(selectedLength);
            remainingFleet.splice(fleetIndex, 1);
            selectedLength = null;
            selectedElement = null;
            undoButton.disabled = lastPlacement.length === 0;
            if(remainingFleet.length === 0)doneButton.disabled = false;
            dom.renderBoard(board, gridElement, false);
        }
        catch(e){
            dom.statusUpdate('placed-ship');
        }
    }

    gridContainer.addEventListener('click', handlePlacement);

}