/**
 * Anti-Chess rules implementation
 */

import type { Board, BoardIndex } from './board.js';
import type { Piece, PieceType, PlayerColor } from './pieces.js';
import { cloneBoard, getPieceAt, setPieceAt, toRowCol } from './board.js';
import { generateLegalMoves, type Move } from './moveGenerator.js';
import { countPieces } from './board.js';

export interface GameState {
  board: Board;
  currentPlayer: PlayerColor;
  winner: PlayerColor | null;
  gameOver: boolean;
  moveHistory: Move[];
}

/**
 * Create a new game state
 */
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'teal',
    winner: null,
    gameOver: false,
    moveHistory: [],
  };
}

/**
 * Create initial board (imported from board module)
 */
function createInitialBoard(): Board {
  const { createInitialBoard: initBoard } = require('./board.js');
  return initBoard();
}

/**
 * Check if a move is legal
 */
export function isMoveLegal(gameState: GameState, move: Move): boolean {
  if (gameState.gameOver) return false;

  const legalMoves = generateLegalMoves(gameState.board, gameState.currentPlayer);
  return legalMoves.some(
    (m) => m.from === move.from && m.to === move.to && m.promotion === move.promotion
  );
}

/**
 * Execute a move and return the new game state
 * This does NOT validate the move - use isMoveLegal first
 */
export function executeMove(gameState: GameState, move: Move): GameState {
  const newBoard = cloneBoard(gameState.board);
  const piece = getPieceAt(newBoard, move.from)!;

  // Remove piece from original square
  setPieceAt(newBoard, move.from, null);

  // Handle promotion
  if (move.promotion) {
    piece.type = move.promotion;
  }

  // Place piece at destination (overwriting any captured piece)
  setPieceAt(newBoard, move.to, piece);

  // Determine next player
  const nextPlayer: PlayerColor =
    gameState.currentPlayer === 'teal' ? 'coral' : 'teal';

  // Check for win conditions
  const winner = checkWinCondition(newBoard, nextPlayer);

  return {
    board: newBoard,
    currentPlayer: nextPlayer,
    winner: winner.winner,
    gameOver: winner.gameOver,
    moveHistory: [...gameState.moveHistory, move],
  };
}

/**
 * Check win conditions in Anti-Chess:
 * 1. Player has no pieces left (wins)
 * 2. Player has no legal moves (stalemate = win)
 */
export function checkWinCondition(
  board: Board,
  player: PlayerColor
): { winner: PlayerColor | null; gameOver: boolean } {
  const opponent = player === 'teal' ? 'coral' : 'teal';

  // Count pieces
  const playerPieces = countPieces(board, player);
  const opponentPieces = countPieces(board, opponent);

  // Win condition 1: A player has no pieces left
  // Note: In Anti-Chess, if YOU have no pieces, YOU WIN
  // But we're checking from the perspective of the player ABOUT TO MOVE
  if (playerPieces === 0) {
    return { winner: player, gameOver: true };
  }
  if (opponentPieces === 0) {
    return { winner: opponent, gameOver: true };
  }

  // Win condition 2: No legal moves (stalemate)
  // Import here to avoid circular dependency
  const { generateLegalMoves } = require('./moveGenerator.js');
  const playerMoves = generateLegalMoves(board, player);

  if (playerMoves.length === 0) {
    // Current player cannot move, so they win (stalemate)
    return { winner: player, gameOver: true };
  }

  // Game continues
  return { winner: null, gameOver: false };
}

/**
 * Check if a player is in check
 * NOTE: In Anti-Chess, check doesn't matter!
 * This function is only for informational purposes
 */
export function isInCheck(board: Board, color: PlayerColor): boolean {
  // Find the king
  let kingIndex: BoardIndex | null = null;
  for (let i = 0; i < 64; i++) {
    const piece = getPieceAt(board, i);
    if (piece?.type === 'king' && piece.color === color) {
      kingIndex = i;
      break;
    }
  }

  if (kingIndex === null) return true; // King captured

  // Check if any opponent piece can capture the king
  const opponent = color === 'teal' ? 'coral' : 'teal';
  const { generateAllPseudoLegalMoves } = require('./moveGenerator.js');
  const opponentMoves = generateAllPseudoLegalMoves(board, opponent);

  return opponentMoves.some((move: Move) => move.to === kingIndex);
}

/**
 * Get all legal moves for the current player
 */
export function getCurrentPlayerLegalMoves(gameState: GameState): Move[] {
  if (gameState.gameOver) return [];
  return generateLegalMoves(gameState.board, gameState.currentPlayer);
}

/**
 * Check if captures are forced for the current player
 */
export function areCapturesForced(gameState: GameState): boolean {
  const { hasCapturesAvailable } = require('./moveGenerator.js');
  return hasCapturesAvailable(gameState.board, gameState.currentPlayer);
}

/**
 * Get a helpful hint about the current position
 */
export function getPositionHint(gameState: GameState): string {
  if (gameState.gameOver) {
    return `Game over! ${gameState.winner} wins!`;
  }

  const legalMoves = getCurrentPlayerLegalMoves(gameState);
  const captures = legalMoves.filter((m) => m.captured);

  if (captures.length === 0) {
    return `${legalMoves.length} non-capture moves available`;
  }

  if (captures.length === 1) {
    return `Forced capture available!`;
  }

  return `${captures.length} captures available (choose any)`;
}
