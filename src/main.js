import { game } from "./game.js";
import './style.css';

const vsComputer = document.getElementById('vs-computer');
const vsPlayer = document.getElementById('vs-player');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const gameStatus =document.getElementById('game-status');
const placemnetPanel = document.getElementById('placement-panel');

vsComputer.addEventListener('click', () =>{
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'flex';
    gameStatus.style.display = 'block';
    game(false);
});

vsPlayer.addEventListener('click', () =>{
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'flex';
    gameStatus.style.display = 'block';
    gameStatus.style.display = 'block';
    game(true);
})