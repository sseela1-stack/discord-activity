/**
 * Game Engine Index
 * Main entry point for the Anti-Chess game engine
 */

// Export all board functions
export {
  toIndex,
  toRowCol,
  isValidSquare,
  createInitialBoard,
  cloneBoard,
  getPieceAt,
  setPieceAt,
  countPieces,
  getPieceIndices,
  isOnSameDiagonal,
  isOnSameRank,
  isOnSameFile,
  type Board,
  type BoardIndex,
} from './board.js';

// Export all piece types and functions
export {
  createPiece,
  clonePiece,
  getOpponentColor,
  type Piece,
  type PieceType,
  type PlayerColor,
} from './pieces.js';

// Export move generation
export {
  generateLegalMoves,
  hasCapturesAvailable,
  type Move,
} from './moveGenerator.js';

// Export game rules
export {
  createInitialGameState,
  isMoveLegal,
  executeMove,
  checkWinCondition,
  isInCheck,
  getCurrentPlayerLegalMoves,
  areCapturesForced,
  getPositionHint,
  type GameState,
} from './rules.js';

// Export win detection
export {
  checkWin,
  getWinDescription,
  wouldMoveEndGame,
  findWinningMoves,
  analyzePosition,
  type WinResult,
  type PositionAnalysis,
} from './winDetection.js';
