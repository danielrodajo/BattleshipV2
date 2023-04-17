import { GameDomain } from './GameDomain';
import { UserDomain } from './UserDomain';

export interface RecordDomain {
  id?: number;
  x: number;
  y: number;
  player?: UserDomain;
  game?: GameDomain;
  type: string;
  createdAt: Date;
}
