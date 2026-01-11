/**
 * Board representation for Anti-Chess
 * 8x8 board using 0-63 indexed array
 */

import type { Piece, PlayerColor } from './pieces.js';
import { createPiece } from './pieces.js';

export type BoardIndex = number; // 0-63
export type Board = (Piece | null)[];

/**
 * Convert row and column to board index
 */
export function toIndex(row: number, col: number): BoardIndex {
  return row * 8 + col;
}

/**
 * Convert board index to row and column
 */
export function toRowCol(index: BoardIndex): { row: number; col: number } {
  return {
    row: Math.floor(index / 8),
    col: index % 8,
  };
}

/**
 * Check if a square is on the board
 */
export function isValidSquare(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Create initial board setup for standard chess
 */
export function createInitialBoard(): Board {
  const board: Board = Array(64).fill(null);

  // Pawns
  for (let col = 0; col < 8; col++) {
    board[toIndex(1, col)] = createPiece('pawn', 'coral');
    board[toIndex(6, col)] = createPiece('pawn', 'teal');
  }

  // Rooks
  board[toIndex(0, 0)] = createPiece('rook', 'coral');
  board[toIndex(0, 7)] = createPiece('rook', 'coral');
  board[toIndex(7, 0)] = createPiece('rook', 'teal');
  board[toIndex(7, 7)] = createPiece('rook', 'teal');

  // Knights
  board[toIndex(0, 1)] = createPiece('knight', 'coral');
  board[toIndex(0, 6)] = createPiece('knight', 'coral');
  board[toIndex(7, 1)] = createPiece('knight', 'teal');
  board[toIndex(7, 6)] = createPiece('knight', 'teal');

  // Bishops
  board[toIndex(0, 2)] = createPiece('bishop', 'coral');
  board[toIndex(0, 5)] = createPiece('bishop', 'coral');
  board[toIndex(7, 2)] = createPiece('bishop', 'teal');
  board[toIndex(7, 5)] = createPiece('bishop', 'teal');

  // Queens
  board[toIndex(0, 3)] = createPiece('queen', 'coral');
  board[toIndex(7, 3)] = createPiece('queen', 'teal');

  // Kings
  board[toIndex(0, 4)] = createPiece('king', 'coral');
  board[toIndex(7, 4)] = createPiece('king', 'teal');

  return board;
}

/**
 * Clone a board (for move simulation)
 */
export function cloneBoard(board: Board): Board {
  return board.map((piece) => (piece ? { ...piece } : null));
}

/**
 * Get piece at index
 */
export function getPieceAt(board: Board, index: BoardIndex): Piece | null {
  return board[index];
}

/**
 * Set piece at index
 */
export function setPieceAt(board: Board, index: BoardIndex, piece: Piece | null): void {
  board[index] = piece;
}

/**
 * Count pieces of a given color
 */
export function countPieces(board: Board, color: PlayerColor): number {
  return board.filter((p) => p?.color === color).length;
}

/**
 * Get all piece indices for a color
 */
export function getPieceIndices(board: Board, color: PlayerColor): BoardIndex[] {
  const indices: BoardIndex[] = [];
  for (let i = 0; i < 64; i++) {
    if (board[i]?.color === color) {
      indices.push(i);
    }
  }
  return indices;
}

/**
 * Check if two squares are on the same diagonal
 */
export function isOnSameDiagonal(from: BoardIndex, to: BoardIndex): boolean {
  const fromRowCol = toRowCol(from);
  const toRowCol = toRowCol(to);
  const rowDiff = Math.abs(fromRowCol.row - toRowCol.row);
  const colDiff = Math.abs(fromRowCol.col - toRowCol.col);
  return rowDiff === colDiff;
}

/**
 * Check if two squares are on the same rank (row)
 */
export function isOnSameRank(from: BoardIndex, to: BoardIndex): boolean {
  return toRowCol(from).row === toRowCol(to).row;
}

/**
 * Check if two squares are on the same file (column)
 */
export function isOnSameFile(from: BoardIndex, to: BoardIndex): boolean {
  return toRowCol(from).col === toRowCol(to).col;
}
