import { game } from "./game.js";
import './style.css';

const vsComputer = document.getElementById('vs-computer');
const vsPlayer = document.getElementById('vs-player');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const gameStatus =document.getElementById('game-status');
const placemnetPanel = document.getElementById('placement-panel');

vsComputer.addEventListener('click', () =>{
    if(!modeSelection) throw new Error("Mode selection not found");
    modeSelection.style.display = 'none';
    if(!gameContainer) throw new Error("Game Container not found");
    gameContainer.style.display = 'flex';
    if(!gameStatus) throw new Error("Game Status not found");
    gameStatus.style.display = 'block';
    game(false);
});

vsPlayer.addEventListener('click', () =>{
    if(!modeSelection) throw new Error("Mode selection not found");
    modeSelection.style.display = 'none';
    if(!gameContainer) throw new Error("Game Container not found");
    gameContainer.style.display = 'flex';
    if(!gameStatus) throw new Error("Game Status not found");
    gameStatus.style.display = 'block';
    if(!placemnetPanel)throw new Error(" Placement plan not found");
    placemnetPanel.style.display = 'block';
    game(true);
})