import { BoardDomain } from './BoardDomain';

export interface GameDomain {
  id: number;
  code: string;
  board1: BoardDomain;
  board2: BoardDomain;
  turn: number;
  state: GameState;
  points: number;
  createdAt: Date;
}

export enum GameState {
  PREPARING,
  CREATED,
  IN_PROGRESS,
  FINALIZED,
}
