import { BoxDomain } from './BoxDomain';
import { EmptyBoxDomain } from './EmptyBoxDomain';
import { UserDomain } from './UserDomain';

export interface BoardDomain {
  id: number;
  code: string;
  owner: UserDomain;
  width: number;
  height: number;
  state: string;
  boxes: BoxDomain[];
  emptyBoxes: EmptyBoxDomain[];
}

export enum BoardState {
  PREPARING, CREATED, IN_PROGRESS, WIN, LOSE
}