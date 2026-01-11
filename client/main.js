import './style.css';

// Chess piece SVG definitions (standard Unicode chess symbols as SVG paths)
const PIECE_SVGS = {
  king: {
    white: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-4-8-4-5 4-8 4-4-3-8-2c-3 6 6 10.5 6 10.5v7V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
    black: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#111" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-4-8-4-5 4-8 4-4-3-8-2c-3 6 6 10.5 6 10.5v7V37z" fill="#111"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/></g></svg>`
  },
  queen: {
    white: `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14.5V25l-7-11 2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5-1.5 5.5-2.5 1-3.5.5-4-1.5M36 26c0 2-1.5 2-2.5 4-1 2.5-1 4.5 1.5 5.5 2.5 1 3.5.5 4-1.5" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
    black: `<svg viewBox="0 0 45 45"><g fill="#111" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="none"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14.5V25l-7-11 2 12z" stroke-linecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1 4.5-1.5 5.5-2.5 1-3.5.5-4-1.5M36 26c0 2-1.5 2-2.5 4-1 2.5-1 4.5 1.5 5.5 2.5 1 3.5.5 4-1.5" stroke-linecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff"/></g></svg>`
  },
  rook: {
    white: `<svg viewBox="0 0 45 45"><g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5c1 2 2 2 2 2h-5s-1.5-1.5-2-4c-.5 2.5-2 4-2 4h-5s1-2 2-2V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>`,
    black: `<svg viewBox="0 0 45 45"><g fill="#111" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5c1 2 2 2 2 2h-5s-1.5-1.5-2-4c-.5 2.5-2 4-2 4h-5s1-2 2-2V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke="#fff" stroke-linejoin="miter"/></g></svg>`
  },
  bishop: {
    white: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45M22.5 9c-9 0-5 17-5 17 0 3 2 7 2 7s2 4 3 3" stroke-linecap="butt"/><path d="M22.5 9c0 2 1.5 5 1.5 5s1.5 3 2.5 3c1 0 2-3 2-3s1.5-3 1.5-5c0-2-1.5-4-2.5-4-1 0-2.5 2-2.5 4M20 20c5 0 4-8 2.5-12M27 20c-5 0-4-8-2.5-12" stroke-linecap="butt"/><path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45M22.5 32c-2.5 0-2.5 3-2.5 3" stroke-linecap="butt"/><path d="M14.5 26c3.5 1 8.5 1 12 0" stroke-linecap="butt"/><path d="M22.5 9c-9 0-5 17-5 17 0 3 2 7 2 7s2 4 3 3" fill="#fff"/></g></svg>`,
    black: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45M22.5 9c-9 0-5 17-5 17 0 3 2 7 2 7s2 4 3 3" stroke-linecap="butt"/><path d="M22.5 9c0 2 1.5 5 1.5 5s1.5 3 2.5 3c1 0 2-3 2-3s1.5-3 1.5-5c0-2-1.5-4-2.5-4-1 0-2.5 2-2.5 4M20 20c5 0 4-8 2.5-12M27 20c-5 0-4-8-2.5-12" stroke-linecap="butt"/><path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45M22.5 32c-2.5 0-2.5 3-2.5 3" stroke-linecap="butt"/><path d="M14.5 26c3.5 1 8.5 1 12 0" stroke-linecap="butt"/><path d="M22.5 9c-9 0-5 17-5 17 0 3 2 7 2 7s2 4 3 3" fill="#111"/><path d="M22.5 9c0 2 1.5 5 1.5 5s1.5 3 2.5 3c1 0 2-3 2-3s1.5-3 1.5-5c0-2-1.5-4-2.5-4-1 0-2.5 2-2.5 4M14.5 26c3.5 1 8.5 1 12 0" stroke="#fff"/></g></svg>`
  },
  knight: {
    white: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke-linecap="butt"/><path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-1.97 4.68-2.32 5 0zM21.5 13.5c3.5-1 4.5 4 2 5" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M22 10c-9 1-11 7-11 14 0 5-2 9-3 10" stroke-linecap="butt"/><path d="M11 28.5c1.5-2.5 3-4.5 6.5-5" stroke-linecap="butt"/><path d="M9 37c6 0 10-5 10-12M11 25c0 1 1.5 3.5 3 5" fill="#fff"/></g></svg>`,
    black: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke-linecap="butt"/><path d="M24 18c.38 2.32-4.68 1.97-5 0 .38-1.97 4.68-2.32 5 0zM21.5 13.5c3.5-1 4.5 4 2 5" stroke-linecap="butt" stroke-linejoin="miter"/><path d="M22 10c-9 1-11 7-11 14 0 5-2 9-3 10" stroke-linecap="butt"/><path d="M11 28.5c1.5-2.5 3-4.5 6.5-5" stroke-linecap="butt"/><path d="M9 37c6 0 10-5 10-12M11 25c0 1 1.5 3.5 3 5" fill="#111"/><path d="M22 10c-9 1-11 7-11 14 0 5-2 9-3 10M9 37c6 0 10-5 10-12M11 25c0 1 1.5 3.5 3 5" stroke="#fff"/></g></svg>`
  },
  pawn: {
    white: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    black: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#111" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`
  }
};

// Initial chess board setup
const INITIAL_BOARD = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

// Game state
let board = [];
let selectedSquare = null;
let currentTurn = 'white';
let moveHistory = [];

// Initialize the game
function initGame() {
  board = INITIAL_BOARD.map((row, rowIndex) =>
    row.map((piece, colIndex) => {
      if (!piece) return null;
      return {
        type: piece,
        color: rowIndex < 2 ? 'black' : 'white'
      };
    })
  );
  render();
}

// Get piece display HTML
function getPieceHTML(piece) {
  if (!piece) return '';
  return `<div class="piece ${piece.color}">${PIECE_SVGS[piece.type][piece.color]}</div>`;
}

// Check if a square is light or dark
function isLightSquare(row, col) {
  return (row + col) % 2 === 0;
}

// Get algebraic notation for a square
function getSquareNotation(row, col) {
  const files = 'abcdefgh';
  const ranks = '87654321';
  return files[col] + ranks[row];
}

// Render the chess board
function render() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <header class="header">
      <div class="header-title">
        <div class="chess-icon">♞</div>
        <h1>Chess</h1>
      </div>
      <div class="header-info">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>Live</span>
        </div>
      </div>
    </header>

    <div class="game-container">
      <div class="player-bar ${currentTurn === 'black' ? 'active' : ''}">
        <div class="player-avatar">♚</div>
        <div class="player-info">
          <div class="player-name">Black</div>
          <div class="player-status">${currentTurn === 'black' ? 'Thinking...' : 'Waiting'}</div>
        </div>
        <div class="player-timer">10:00</div>
      </div>

      <div class="board-container">
        <div class="board">
          ${renderBoard()}
        </div>
      </div>

      <div class="player-bar bottom ${currentTurn === 'white' ? 'active' : ''}">
        <div class="player-avatar">♔</div>
        <div class="player-info">
          <div class="player-name">White</div>
          <div class="player-status">${currentTurn === 'white' ? 'Your turn' : 'Waiting'}</div>
        </div>
        <div class="player-timer">10:00</div>
      </div>

      <div class="controls">
        <button class="btn btn-primary" onclick="resetGame()">
          <span>⟳</span> New Game
        </button>
        <button class="btn btn-secondary" onclick="flipBoard()">
          <span>⇄</span> Flip Board
        </button>
      </div>

      <div class="move-history">
        <div class="move-history-title">Move History</div>
        <div class="moves-list">
          ${moveHistory.length === 0 ? '<span class="move">No moves yet</span>' :
            moveHistory.map((move, i) => `<span class="move ${i === moveHistory.length - 1 ? 'latest' : ''}">${move}</span>`).join('')
          }
        </div>
      </div>
    </div>
  `;

  // Attach click handlers
  document.querySelectorAll('.square').forEach(square => {
    square.addEventListener('click', handleSquareClick);
  });
}

// Render the board squares
function renderBoard() {
  let html = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      const isLight = isLightSquare(row, col);
      const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;

      let classes = `square ${isLight ? 'light' : 'dark'}`;
      if (isSelected) classes += ' selected';

      html += `
        <div class="${classes}" data-row="${row}" data-col="${col}">
          ${piece ? getPieceHTML(piece) : ''}
          ${col === 0 ? `<span class="coordinates coord-rank">${8 - row}</span>` : ''}
          ${row === 7 ? `<span class="coordinates coord-file">${String.fromCharCode(97 + col)}</span>` : ''}
        </div>
      `;
    }
  }
  return html;
}

// Handle square click
function handleSquareClick(e) {
  const square = e.currentTarget;
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const clickedPiece = board[row][col];

  if (selectedSquare) {
    const { row: fromRow, col: fromCol } = selectedSquare;
    const piece = board[fromRow][fromCol];

    // If clicking on same square, deselect
    if (fromRow === row && fromCol === col) {
      selectedSquare = null;
      render();
      return;
    }

    // If clicking on own piece, select it instead
    if (clickedPiece && clickedPiece.color === piece.color) {
      selectedSquare = { row, col };
      render();
      return;
    }

    // Make the move
    makeMove(fromRow, fromCol, row, col);
  } else {
    // Select a piece
    if (clickedPiece && clickedPiece.color === currentTurn) {
      selectedSquare = { row, col };
      render();
    }
  }
}

// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const capturedPiece = board[toRow][toCol];

  // Record the move
  const fromNotation = getSquareNotation(fromRow, fromCol);
  const toNotation = getSquareNotation(toRow, toCol);
  const pieceSymbol = getPieceSymbol(piece);
  const captureSymbol = capturedPiece ? 'x' : '';
  const moveNotation = `${pieceSymbol}${captureSymbol}${toNotation}`;

  moveHistory.push(moveNotation);

  // Update the board
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = null;

  // Handle pawn promotion (auto-promote to queen for simplicity)
  if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
    piece.type = 'queen';
  }

  // Switch turns
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  selectedSquare = null;

  render();
}

// Get piece symbol for notation
function getPieceSymbol(piece) {
  const symbols = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: ''
  };
  return symbols[piece.type];
}

// Reset the game
window.resetGame = function() {
  board = [];
  selectedSquare = null;
  currentTurn = 'white';
  moveHistory = [];
  initGame();
};

// Flip board (visual only for now)
window.flipBoard = function() {
  // Reverse the board array
  board = board.reverse().map(row => row.reverse());
  render();
};

// Start the game
initGame();
