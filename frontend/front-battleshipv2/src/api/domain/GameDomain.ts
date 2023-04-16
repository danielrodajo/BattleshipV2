import { BoardDomain } from './BoardDomain';

export interface GameDomain {
  id: number;
  code: string;
  board1: BoardDomain;
  board2: BoardDomain;
  turn: number;
  state: GameState;
  createdAt: Date;
}

export enum GameState {
  CREATED,
  IN_PROGRESS,
  FINALIZED,
}
