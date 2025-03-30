// Game state management
const gameState = {
    board: {
        a1: "", a2: "", a3: "",
        b1: "", b2: "", b3: "",
        c1: "", c2: "", c3: ""
    },
    player: "",
    computer: "",
    counter: 0,
    scores: {
        human: 0,
        computer: 0
    },
    isGameActive: false,
    difficulty: 'medium' // Default difficulty
};

// Game constants
const WINNING_COMBINATIONS = [
    ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'], // Rows
    ['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'], // Columns
    ['a1', 'b2', 'c3'], ['a3', 'b2', 'c1'] // Diagonals
];

// DOM Elements
const elements = {
    cells: document.querySelectorAll('.game-cell'),
    playXBtn: document.getElementById('playX'),
    playOBtn: document.getElementById('playO'),
    resetBtn: document.getElementById('reset'),
    humanScore: document.getElementById('humanScore'),
    computerScore: document.getElementById('computerScore'),
    gameStatus: document.getElementById('gameStatus'),
    difficultyButtons: {
        easy: document.getElementById('easyMode'),
        medium: document.getElementById('mediumMode'),
        hard: document.getElementById('hardMode')
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    elements.playXBtn.addEventListener('click', () => selectPlayer('X'));
    elements.playOBtn.addEventListener('click', () => selectPlayer('O'));
    elements.resetBtn.addEventListener('click', resetGame);
    elements.cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    // Difficulty selection
    Object.entries(elements.difficultyButtons).forEach(([difficulty, button]) => {
        button.addEventListener('click', () => selectDifficulty(difficulty));
    });

    // Set default difficulty
    elements.difficultyButtons.medium.classList.add('active');
});

// Difficulty Selection
function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    
    // Update button states
    Object.entries(elements.difficultyButtons).forEach(([diff, button]) => {
        button.classList.toggle('active', diff === difficulty);
    });

    updateGameStatus(`Difficulty set to ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`);
}

// Game Logic Functions
function selectPlayer(symbol) {
    if (gameState.isGameActive) {
        updateGameStatus('Please reset the game to change your symbol');
        return;
    }

    gameState.player = symbol;
    gameState.computer = symbol === 'X' ? 'O' : 'X';
    gameState.isGameActive = true;
    
    updateGameStatus(`You are playing as ${symbol}`);
    updateButtonStates();
    
    if (gameState.computer === 'X') {
        setTimeout(computerMove, 500);
    }
}

function handleCellClick(cell) {
    if (!gameState.isGameActive) {
        updateGameStatus('Please select your symbol first');
        return;
    }

    const cellId = cell.id;
    if (gameState.board[cellId] !== "") {
        updateGameStatus('This cell is already taken!');
        return;
    }

    makeMove(cellId, gameState.player);
    if (checkGameEnd()) return;

    setTimeout(computerMove, 500);
}

function computerMove() {
    if (!gameState.isGameActive) return;

    const move = findBestMove();
    makeMove(move, gameState.computer);
    checkGameEnd();
}

function findBestMove() {
    const difficultySettings = {
        easy: {
            smartMoveChance: 0.3,
            blockChance: 0.2,
            centerChance: 0.3,
            cornerChance: 0.2
        },
        medium: {
            smartMoveChance: 0.7,
            blockChance: 0.5,
            centerChance: 0.7,
            cornerChance: 0.6
        },
        hard: {
            smartMoveChance: 1,
            blockChance: 1,
            centerChance: 1,
            cornerChance: 1
        }
    };

    const settings = difficultySettings[gameState.difficulty];

    // Try to win
    const winningMove = findWinningMove(gameState.computer);
    if (winningMove) return winningMove;

    // Block player's winning move based on difficulty
    if (Math.random() < settings.blockChance) {
        const blockingMove = findWinningMove(gameState.player);
        if (blockingMove) return blockingMove;
    }

    // Take center based on difficulty
    if (Math.random() < settings.centerChance && gameState.board.b2 === "") {
        return 'b2';
    }

    // Take corners based on difficulty
    if (Math.random() < settings.cornerChance) {
        const corners = ['a1', 'a3', 'c1', 'c3'];
        const availableCorners = corners.filter(corner => gameState.board[corner] === "");
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }

    // Take any available space
    const availableMoves = Object.entries(gameState.board)
        .filter(([_, value]) => value === "")
        .map(([key]) => key);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function findWinningMove(symbol) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const values = [gameState.board[a], gameState.board[b], gameState.board[c]];
        
        if (values.filter(v => v === symbol).length === 2 && 
            values.filter(v => v === "").length === 1) {
            return combination[values.indexOf("")];
        }
    }
    return null;
}

function makeMove(cellId, symbol) {
    gameState.board[cellId] = symbol;
    gameState.counter++;
    
    const cell = document.getElementById(cellId);
    cell.textContent = symbol;
    cell.classList.add(symbol.toLowerCase());
}

function checkGameEnd() {
    // Check for win
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            handleGameEnd(gameState.board[a]);
            return true;
        }
    }

    // Check for tie
    if (gameState.counter === 9) {
        handleGameEnd(null);
        return true;
    }

    return false;
}

function handleGameEnd(winner) {
    gameState.isGameActive = false;
    
    if (winner) {
        if (winner === gameState.player) {
            gameState.scores.human++;
            updateGameStatus('Congratulations! You won!');
        } else {
            gameState.scores.computer++;
            updateGameStatus('Game Over! Computer won!');
        }
    } else {
        updateGameStatus('It\'s a tie!');
    }
    
    updateScoreBoard();
    updateButtonStates();
}

// UI Update Functions
function updateGameStatus(message) {
    elements.gameStatus.textContent = message;
}

function updateScoreBoard() {
    elements.humanScore.textContent = gameState.scores.human;
    elements.computerScore.textContent = gameState.scores.computer;
}

function updateButtonStates() {
    elements.playXBtn.disabled = gameState.isGameActive;
    elements.playOBtn.disabled = gameState.isGameActive;
    elements.resetBtn.disabled = !gameState.isGameActive && gameState.counter === 0;
}

function resetGame() {
    // Reset board
    Object.keys(gameState.board).forEach(key => {
        gameState.board[key] = "";
        const cell = document.getElementById(key);
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });

    // Reset game state
    gameState.counter = 0;
    gameState.isGameActive = false;
    gameState.player = "";
    gameState.computer = "";

    // Reset UI
    updateGameStatus('Choose your symbol to start playing!');
    updateButtonStates();
    elements.playXBtn.textContent = 'Play as X';
    elements.playOBtn.textContent = 'Play as O';
}