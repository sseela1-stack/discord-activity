/**
 * Win detection for Anti-Chess
 */

import type { Board, BoardIndex } from './board.js';
import type { PlayerColor } from './pieces.js';
import { countPieces, getPieceAt } from './board.js';
import { generateLegalMoves, type Move } from './moveGenerator.js';

export interface WinResult {
  hasWinner: boolean;
  winner: PlayerColor | null;
  reason: 'no_pieces' | 'no_moves' | null;
}

/**
 * Check if the game has been won
 * Anti-Chess win conditions:
 * 1. A player has no pieces left
 * 2. A player has no legal moves (stalemate)
 */
export function checkWin(board: Board, currentPlayer: PlayerColor): WinResult {
  const opponent: PlayerColor = currentPlayer === 'teal' ? 'coral' : 'teal';

  // Count pieces
  const currentPlayerPieces = countPieces(board, currentPlayer);
  const opponentPieces = countPieces(board, opponent);

  // Win condition 1: A player has no pieces
  if (currentPlayerPieces === 0) {
    return {
      hasWinner: true,
      winner: currentPlayer,
      reason: 'no_pieces',
    };
  }

  if (opponentPieces === 0) {
    return {
      hasWinner: true,
      winner: opponent,
      reason: 'no_pieces',
    };
  }

  // Win condition 2: No legal moves (stalemate = win for player who cannot move)
  const legalMoves = generateLegalMoves(board, currentPlayer);

  if (legalMoves.length === 0) {
    return {
      hasWinner: true,
      winner: currentPlayer,
      reason: 'no_moves',
    };
  }

  // No winner yet
  return {
    hasWinner: false,
    winner: null,
    reason: null,
  };
}

/**
 * Get a description of why a player won
 */
export function getWinDescription(result: WinResult): string {
  if (!result.hasWinner) {
    return 'Game in progress';
  }

  if (result.reason === 'no_pieces') {
    return `${result.winner} wins by losing all pieces!`;
  }

  if (result.reason === 'no_moves') {
    return `${result.winner} wins by stalemate (no legal moves)!`;
  }

  return `${result.winner} wins!`;
}

/**
 * Check if a specific move would end the game
 */
export function wouldMoveEndGame(board: Board, move: Move): boolean {
  // Simulate the move
  const { cloneBoard, setPieceAt } = require('./board.js');
  const testBoard = cloneBoard(board);

  const piece = getPieceAt(testBoard, move.from)!;

  // Handle promotion
  if (move.promotion) {
    piece.type = move.promotion;
  }

  setPieceAt(testBoard, move.from, null);
  setPieceAt(testBoard, move.to, piece);

  // Check if opponent has any legal moves
  const opponent: PlayerColor = move.piece.color === 'teal' ? 'coral' : 'teal';
  const opponentMoves = generateLegalMoves(testBoard, opponent);

  return opponentMoves.length === 0;
}

/**
 * Find all winning moves (moves that leave opponent with no legal moves)
 */
export function findWinningMoves(board: Board, player: PlayerColor): Move[] {
  const legalMoves = generateLegalMoves(board, player);
  const winningMoves: Move[] = [];

  for (const move of legalMoves) {
    if (wouldMoveEndGame(board, move)) {
      winningMoves.push(move);
    }
  }

  return winningMoves;
}

/**
 * Analyze the current position
 */
export interface PositionAnalysis {
  currentPlayer: PlayerColor;
  legalMoves: number;
  capturesAvailable: number;
  winningMoves: number;
  isForcedCapture: boolean;
  canWinImmediately: boolean;
}

export function analyzePosition(board: Board, player: PlayerColor): PositionAnalysis {
  const legalMoves = generateLegalMoves(board, player);
  const capturesAvailable = legalMoves.filter((m) => m.captured).length;
  const winningMoves = findWinningMoves(board, player);

  return {
    currentPlayer: player,
    legalMoves: legalMoves.length,
    capturesAvailable,
    winningMoves: winningMoves.length,
    isForcedCapture: capturesAvailable > 0 && capturesAvailable === legalMoves.length,
    canWinImmediately: winningMoves.length > 0,
  };
}
