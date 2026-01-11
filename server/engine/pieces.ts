/**
 * Piece types for Anti-Chess
 */

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PlayerColor = 'teal' | 'coral';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export interface Square {
  piece: Piece | null;
  index: number;
}

/**
 * Create a new piece
 */
export function createPiece(type: PieceType, color: PlayerColor): Piece {
  return { type, color };
}

/**
 * Clone a piece (for move simulation)
 */
export function clonePiece(piece: Piece): Piece {
  return { ...piece };
}

/**
 * Get the opponent color
 */
export function getOpponentColor(color: PlayerColor): PlayerColor {
  return color === 'teal' ? 'coral' : 'teal';
}
