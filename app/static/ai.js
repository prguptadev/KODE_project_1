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
