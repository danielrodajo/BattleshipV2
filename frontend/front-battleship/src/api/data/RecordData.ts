import { GameDomain } from '../domain/GameDomain';
import { UserDomain } from '../domain/UserDomain';

export interface RecordData {
  id?: number;
  x: string;
  y: number;
  player?: UserDomain;
  game?: GameDomain;
  type: string;
  createdAt: Date;
}
