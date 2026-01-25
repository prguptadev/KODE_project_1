const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const aiModeButton = document.getElementById('aiModeButton');
const cells = document.querySelectorAll('.cell');

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let aiMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin()) {
        endGame(false);
    } else if (boardState.every(cell => cell !== '')) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (aiMode && currentPlayer === 'O') {
            aiMove();
        }
    }
};

const checkWin = () => {
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            return true;
        }
    }
    return false;
};

const endGame = (draw) => {
    gameActive = false;
    if (draw) {
        message.textContent = 'It\'s a draw!';
    } else {
        message.textContent = `${currentPlayer} wins!`;
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
};

const resetGame = () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    message.textContent = '';
};

const toggleAiMode = () => {
    aiMode = !aiMode;
    aiModeButton.textContent = aiMode ? 'Play vs Human' : 'Play vs AI';
    resetGame();
};

const aiMove = () => {
    let availableMoves = [];
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            availableMoves.push(i);
        }
    }

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const move = availableMoves[randomIndex];
    
    boardState[move] = 'O';
    cells[move].textContent = 'O';

    if (checkWin()) {
        endGame(false);
    } else if (boardState.every(cell => cell !== '')) {
        endGame(true);
    } else {
        currentPlayer = 'X';
    }
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
aiModeButton.addEventListener('click', toggleAiMode);