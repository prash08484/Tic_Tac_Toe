const HUMAN = 'X';
const COMPUTER = 'O';
let board = Array(9).fill(null);
let currentPlayer = HUMAN;

// Function to start/restart the game
function startGame() {
    document.getElementById("restart").innerText="🔄 Restart";
    board = Array(9).fill(null);
    currentPlayer = HUMAN;
    document.getElementById('message').innerText = "Your Turn!";
    document.getElementById("message").style.color = "white";
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

// Check if the game is over
function checkWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

// Get the best move for the computer
function getBestMove(board) {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = COMPUTER;
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

// Minimax algorithm for optimal moves
function minimax(board, depth, isMaximizing) {
    if (checkWinner(board, COMPUTER)) return 10 - depth;
    if (checkWinner(board, HUMAN)) return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = COMPUTER;
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = HUMAN;
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Handle player move
function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] || checkWinner(board, HUMAN) || checkWinner(board, COMPUTER)) return;

    board[index] = HUMAN;
    e.target.innerText = HUMAN;
    e.target.classList.add('taken');

    if (checkWinner(board, HUMAN)) {
        document.getElementById('message').innerText = "You Win!";
        document.getElementById("message").style.color = "green";
        return;
    }

    if (!board.includes(null)) {
        document.getElementById('message').innerText = "It's a Draw!";
        document.getElementById("message").style.color = "#FFFF00";
        return;
    }

    const bestMove = getBestMove(board);
    board[bestMove] = COMPUTER;
    const computerCell = document.querySelector(`[data-index='${bestMove}']`);
    computerCell.innerText = COMPUTER;
    computerCell.classList.add('taken');

    if (checkWinner(board, COMPUTER)) {
        document.getElementById('message').innerText = "Computer Wins!"; 
        document.getElementById("message").style.color = "#8FBC8F";
        return;
    }

    if (!board.includes(null)) {
        document.getElementById('message').innerText = "It's a Draw!";
        document.getElementById("message").style.color = "#FFFF00";
        return;
    }

    document.getElementById('message').innerText = "Your Turn!";
    document.getElementById("message").style.color = "white";
}

// Initialize the game
startGame();
