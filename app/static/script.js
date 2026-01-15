const board = document.getElementById('board');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const aiModeButton = document.getElementById('aiModeButton');
let currentPlayer = 1;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'human'; // 'human' or 'ai'

const clickSound = new Audio('/static/click.mp3');
const winSound = new Audio('/static/win.mp3');
const drawSound = new Audio('/static/draw.mp3');

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];


function checkWinner(board, player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function getEmptyCells(board) {
    return board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
}

function celebrate() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, particleCount: 70, gravity: 0.5, decay: 0.94, openOn: 0.75 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    (function frame() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        confetti.reset();
        return;
      }

      const particleCount = 50 + Math.floor(randomInRange(50, 100));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } }));

      requestAnimationFrame(frame);
    })();
}

function applySparkle(elements) {
    elements.forEach(el => {
        el.classList.add('sparkle');
        el.addEventListener('animationend', () => {
            el.classList.remove('sparkle');
        }, { once: true });
    });
}

function checkWin() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            message.innerText = `Player ${currentPlayer} wins!`;
            gameActive = false;
            const winningCells = [document.querySelector(`[data-index="${a}"]`), document.querySelector(`[data-index="${b}"]`), document.querySelector(`[data-index="${c}"]`)];
            applySparkle(winningCells);
            celebrate(); // Confetti on win
            winSound.play();
            return true; // Indicate win
        }
    }

    if (!gameBoard.includes('')) {
        message.innerText = 'It\'s a draw!';
        gameActive = false;
        applySparkle(document.querySelectorAll('.cell'));
        drawSound.play();
        return false; // Indicate draw, not win
    }
    return false; // No win or draw yet
}



function minimax(newBoard, depth, isMaximizingPlayer) {
    const aiPlayer = 'O';
    const humanPlayer = 'X';

    if (checkWinner(newBoard, aiPlayer)) {
        return 10 - depth;
    } else if (checkWinner(newBoard, humanPlayer)) {
        return depth - 10;
    } else if (getEmptyCells(newBoard).length === 0) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        const emptyCells = getEmptyCells(newBoard);
        for (let i = 0; i < emptyCells.length; i++) {
            const cellIndex = emptyCells[i];
            newBoard[cellIndex] = aiPlayer;
            let score = minimax(newBoard, depth + 1, false);
            newBoard[cellIndex] = '';
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        const emptyCells = getEmptyCells(newBoard);
        for (let i = 0; i < emptyCells.length; i++) {
            const cellIndex = emptyCells[i];
            newBoard[cellIndex] = humanPlayer;
            let score = minimax(newBoard, depth + 1, true);
            newBoard[cellIndex] = '';
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
}

function aiMove() {
    const aiPlayer = 'O';
    const emptyCells = getEmptyCells(gameBoard);
    
    if (emptyCells.length === 9) { // If board is empty, pick a corner or center
        const corners = [0, 2, 6, 8];
        const center = 4;
        const choices = corners.concat(center);
        const randomIndex = Math.floor(Math.random() * choices.length);
        const bestMove = choices[randomIndex];
        gameBoard[bestMove] = aiPlayer;
        document.querySelector(`[data-index="${bestMove}"]`).innerText = aiPlayer;
        document.querySelector(`[data-index="${bestMove}"]`).classList.add(aiPlayer);
        clickSound.play();

        if (checkWin()) {
            return;
        }
        currentPlayer = 1;
        message.innerText = `Player ${currentPlayer}'s turn`;
        return;
    }

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < emptyCells.length; i++) {
        const cellIndex = emptyCells[i];
        gameBoard[cellIndex] = aiPlayer;
        let score = minimax(gameBoard, 0, false);
        gameBoard[cellIndex] = ''; // Undo the move

        if (score > bestScore) {
            bestScore = score;
            bestMove = cellIndex;
        }
    }

    if (bestMove !== -1 && gameActive) {
        gameBoard[bestMove] = aiPlayer;
        const cellElement = document.querySelector(`[data-index="${bestMove}"]`);
        cellElement.innerText = aiPlayer;
        cellElement.classList.add(aiPlayer);
        clickSound.play();

        if (checkWin()) {
            return;
        }

        currentPlayer = 1; // Switch back to human player
        message.innerText = `Player ${currentPlayer}'s turn`;
    }
}


function cellClick(event) {
    const index = parseInt(event.target.dataset.index);

    if (gameBoard[index] === '' && gameActive) {
        const playerMark = currentPlayer === 1 ? 'X' : 'O';
        gameBoard[index] = playerMark;
        event.target.innerText = playerMark;
        event.target.classList.add(playerMark);
        clickSound.play();
        
        const win = checkWin(); // Check for win/draw

        if (gameActive) { // Only switch player if game is still active
            if (gameMode === 'human') {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                message.innerText = `Player ${currentPlayer}'s turn`;
            } else { // AI mode
                currentPlayer = 2; // Switch to AI player
                message.innerText = `AI's turn`;
                setTimeout(aiMove, 1000); // Short delay before AI moves
            }
        }
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 1;
    message.innerText = `Player ${currentPlayer}'s turn`;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('X', 'O', 'sparkle');
    });
    aiModeButton.innerText = `Play vs ${gameMode === 'human' ? 'AI' : 'Human'}`;
}


const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', cellClick);
});

resetButton.addEventListener('click', resetGame);

aiModeButton.addEventListener('click', () => {
    gameMode = gameMode === 'human' ? 'ai' : 'human';
    resetGame();
    message.innerText = `Game mode: ${gameMode === 'human' ? 'Human vs Human' : 'Human vs AI'}`;
});

resetGame();