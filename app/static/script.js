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


function aiMove() {
    const emptyCells = [];
    gameBoard.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length > 0 && gameActive) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const index = emptyCells[randomIndex];
        const playerMark = currentPlayer === 1 ? 'X' : 'O';
        gameBoard[index] = playerMark;
        const cellElement = document.querySelector(`[data-index="${index}"]`);
        cellElement.innerText = playerMark;
        cellElement.classList.add(playerMark);
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