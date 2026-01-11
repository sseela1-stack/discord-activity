/**
 * Room management for WebSocket games
 */

import type { GameState, Move } from '../engine/index.js';
import { createInitialGameState, isMoveLegal, executeMove } from '../engine/index.js';

export interface Player {
  id: string;
  name: string;
  color?: 'teal' | 'coral';
  isSpectator: boolean;
}

export interface GameRoom {
  id: string;
  players: Map<string, Player>;
  gameState: GameState;
  maxPlayers: number;
  createdAt: number;
}

export class RoomManager {
  private rooms: Map<string, GameRoom> = new Map();

  /**
   * Create a new game room
   */
  createRoom(roomId: string): GameRoom {
    if (this.rooms.has(roomId)) {
      throw new Error(`Room ${roomId} already exists`);
    }

    const room: GameRoom = {
      id: roomId,
      players: new Map(),
      gameState: createInitialGameState(),
      maxPlayers: 2,
      createdAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  /**
   * Get a room by ID
   */
  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Delete a room
   */
  deleteRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  /**
   * Add a player to a room
   */
  addPlayer(roomId: string, player: Player): GameRoom {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const activePlayers = Array.from(room.players.values()).filter((p) => !p.isSpectator);

    if (activePlayers.length >= room.maxPlayers && !player.isSpectator) {
      // Room is full, make them a spectator
      player.isSpectator = true;
    }

    // Assign color if not a spectator
    if (!player.isSpectator && player.color === undefined) {
      const tealPlayer = activePlayers.find((p) => p.color === 'teal');
      const coralPlayer = activePlayers.find((p) => p.color === 'coral');

      if (!tealPlayer) {
        player.color = 'teal';
      } else if (!coralPlayer) {
        player.color = 'coral';
      } else {
        // Both colors taken, make spectator
        player.isSpectator = true;
      }
    }

    room.players.set(player.id, player);
    return room;
  }

  /**
   * Remove a player from a room
   */
  removePlayer(roomId: string, playerId: string): GameRoom | null {
    const room = this.getRoom(roomId);
    if (!room) {
      return null;
    }

    room.players.delete(playerId);

    // Delete room if empty
    if (room.players.size === 0) {
      this.deleteRoom(roomId);
      return null;
    }

    return room;
  }

  /**
   * Get a player from a room
   */
  getPlayer(roomId: string, playerId: string): Player | undefined {
    const room = this.getRoom(roomId);
    return room?.players.get(playerId);
  }

  /**
   * Execute a move in a room
   */
  makeMove(roomId: string, move: Move, playerId: string): GameState {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    // Verify it's this player's turn
    const player = room.players.get(playerId);
    if (!player || player.color !== room.gameState.currentPlayer) {
      throw new Error('Not your turn');
    }

    // Verify move is legal
    if (!isMoveLegal(room.gameState, move)) {
      throw new Error('Illegal move');
    }

    // Execute move
    room.gameState = executeMove(room.gameState, move);

    return room.gameState;
  }

  /**
   * Reset a room's game
   */
  resetGame(roomId: string): GameState {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    room.gameState = createInitialGameState();

    // Reset player colors
    const playerArray = Array.from(room.players.values());
    let assignedTeal = false;
    let assignedCoral = false;

    for (const player of playerArray) {
      if (!player.isSpectator) {
        if (!assignedTeal) {
          player.color = 'teal';
          assignedTeal = true;
        } else if (!assignedCoral) {
          player.color = 'coral';
          assignedCoral = true;
        }
      }
    }

    return room.gameState;
  }

  /**
   * Get all active rooms
   */
  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Get room count
   */
  getRoomCount(): number {
    return this.rooms.size;
  }

  /**
   * Clean up empty rooms (for maintenance)
   */
  cleanupEmptyRooms(): number {
    let cleaned = 0;
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.players.size === 0) {
        this.deleteRoom(roomId);
        cleaned++;
      }
    }
    return cleaned;
  }
}
