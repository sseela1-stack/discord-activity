/**
 * Move generation for Anti-Chess
 * Key rule: Captures are MANDATORY if available
 */

import type { Board, BoardIndex } from './board.js';
import type { Piece, PieceType, PlayerColor } from './pieces.js';
import {
  getPieceAt,
  toRowCol,
  isValidSquare,
  isOnSameDiagonal,
  isOnSameRank,
  isOnSameFile,
} from './board.js';
import { getOpponentColor } from './pieces.js';

export interface Move {
  from: BoardIndex;
  to: BoardIndex;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
}

/**
 * Generate all legal moves for a player
 * IMPORTANT: If any capture exists, ONLY return captures
 */
export function generateLegalMoves(board: Board, color: PlayerColor): Move[] {
  const allMoves = generateAllPseudoLegalMoves(board, color);
  const captures = allMoves.filter((m) => m.captured);

  // Anti-Chess rule: Captures are mandatory
  if (captures.length > 0) {
    return captures;
  }

  return allMoves;
}

/**
 * Check if there are any captures available for a player
 */
export function hasCapturesAvailable(board: Board, color: PlayerColor): boolean {
  const allMoves = generateAllPseudoLegalMoves(board, color);
  return allMoves.some((m) => m.captured !== undefined);
}

/**
 * Generate all pseudo-legal moves (without forced capture rule)
 */
function generateAllPseudoLegalMoves(board: Board, color: PlayerColor): Move[] {
  const moves: Move[] = [];

  for (let from = 0; from < 64; from++) {
    const piece = getPieceAt(board, from);
    if (!piece || piece.color !== color) continue;

    const pieceMoves = generateMovesForPiece(board, from, piece);
    moves.push(...pieceMoves);
  }

  return moves;
}

/**
 * Generate moves for a specific piece
 */
function generateMovesForPiece(board: Board, from: BoardIndex, piece: Piece): Move[] {
  switch (piece.type) {
    case 'pawn':
      return generatePawnMoves(board, from, piece);
    case 'rook':
      return generateRookMoves(board, from, piece);
    case 'knight':
      return generateKnightMoves(board, from, piece);
    case 'bishop':
      return generateBishopMoves(board, from, piece);
    case 'queen':
      return generateQueenMoves(board, from, piece);
    case 'king':
      return generateKingMoves(board, from, piece);
  }
}

/**
 * Generate pawn moves (including captures and promotions)
 * In Anti-Chess, pawns can always capture diagonally
 */
function generatePawnMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  const moves: Move[] = [];
  const { row, col } = toRowCol(from);
  const direction = piece.color === 'teal' ? -1 : 1; // teal moves up (decreasing row), coral moves down

  // Single forward move (only if destination is empty)
  const forwardRow = row + direction;
  if (isValidSquare(forwardRow, col)) {
    const forwardIndex = forwardRow * 8 + col;
    if (!getPieceAt(board, forwardIndex)) {
      // Check for promotion
      if (forwardRow === 0 || forwardRow === 7) {
        // Promotion - can promote to queen, rook, bishop, or knight
        const promotions: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
        for (const promoType of promotions) {
          moves.push({
            from,
            to: forwardIndex,
            piece,
            promotion: promoType,
          });
        }
      } else {
        moves.push({
          from,
          to: forwardIndex,
          piece,
        });
      }

      // Double move from starting position
      const startRow = piece.color === 'teal' ? 6 : 1;
      if (row === startRow) {
        const doubleForwardRow = row + 2 * direction;
        const doubleForwardIndex = doubleForwardRow * 8 + col;
        if (!getPieceAt(board, doubleForwardIndex)) {
          moves.push({
            from,
            to: doubleForwardIndex,
            piece,
          });
        }
      }
    }
  }

  // Diagonal captures (must have opponent piece)
  const captureCols = [col - 1, col + 1];
  for (const captureCol of captureCols) {
    if (isValidSquare(forwardRow, captureCol)) {
      const captureIndex = forwardRow * 8 + captureCol;
      const targetPiece = getPieceAt(board, captureIndex);
      if (targetPiece && targetPiece.color !== piece.color) {
        // Capture with promotion check
        if (forwardRow === 0 || forwardRow === 7) {
          const promotions: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
          for (const promoType of promotions) {
            moves.push({
              from,
              to: captureIndex,
              piece,
              captured: targetPiece,
              promotion: promoType,
            });
          }
        } else {
          moves.push({
            from,
            to: captureIndex,
            piece,
            captured: targetPiece,
          });
        }
      }
    }
  }

  return moves;
}

/**
 * Generate rook moves (horizontal and vertical)
 */
function generateRookMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  const moves: Move[] = [];
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  for (const [rowDir, colDir] of directions) {
    let { row, col } = toRowCol(from);
    row += rowDir;
    col += colDir;

    while (isValidSquare(row, col)) {
      const toIndex = row * 8 + col;
      const targetPiece = getPieceAt(board, toIndex);

      if (!targetPiece) {
        // Empty square
        moves.push({
          from,
          to: toIndex,
          piece,
        });
      } else {
        // Occupied square
        if (targetPiece.color !== piece.color) {
          // Capture
          moves.push({
            from,
            to: toIndex,
            piece,
            captured: targetPiece,
          });
        }
        break; // Can't move past any piece
      }

      row += rowDir;
      col += colDir;
    }
  }

  return moves;
}

/**
 * Generate knight moves (L-shaped)
 */
function generateKnightMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  const moves: Move[] = [];
  const { row, col } = toRowCol(from);
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  for (const [rowOffset, colOffset] of offsets) {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;

    if (isValidSquare(newRow, newCol)) {
      const toIndex = newRow * 8 + newCol;
      const targetPiece = getPieceAt(board, toIndex);

      if (!targetPiece) {
        moves.push({
          from,
          to: toIndex,
          piece,
        });
      } else if (targetPiece.color !== piece.color) {
        moves.push({
          from,
          to: toIndex,
          piece,
          captured: targetPiece,
        });
      }
    }
  }

  return moves;
}

/**
 * Generate bishop moves (diagonal)
 */
function generateBishopMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  const moves: Move[] = [];
  const directions = [
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
  ];

  for (const [rowDir, colDir] of directions) {
    let { row, col } = toRowCol(from);
    row += rowDir;
    col += colDir;

    while (isValidSquare(row, col)) {
      const toIndex = row * 8 + col;
      const targetPiece = getPieceAt(board, toIndex);

      if (!targetPiece) {
        moves.push({
          from,
          to: toIndex,
          piece,
        });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({
            from,
            to: toIndex,
            piece,
            captured: targetPiece,
          });
        }
        break;
      }

      row += rowDir;
      col += colDir;
    }
  }

  return moves;
}

/**
 * Generate queen moves (rook + bishop)
 */
function generateQueenMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  return [...generateRookMoves(board, from, piece), ...generateBishopMoves(board, from, piece)];
}

/**
 * Generate king moves (one square in any direction)
 * In Anti-Chess, king has no special status and can be captured
 */
function generateKingMoves(board: Board, from: BoardIndex, piece: Piece): Move[] {
  const moves: Move[] = [];
  const { row, col } = toRowCol(from);
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [rowDir, colDir] of directions) {
    const newRow = row + rowDir;
    const newCol = col + colDir;

    if (isValidSquare(newRow, newCol)) {
      const toIndex = newRow * 8 + newCol;
      const targetPiece = getPieceAt(board, toIndex);

      if (!targetPiece) {
        moves.push({
          from,
          to: toIndex,
          piece,
        });
      } else if (targetPiece.color !== piece.color) {
        moves.push({
          from,
          to: toIndex,
          piece,
          captured: targetPiece,
        });
      }
    }
  }

  return moves;
}
