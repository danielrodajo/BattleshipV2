import { EmptyBoxDomain } from '../domain/EmptyBoxDomain';
import { UserDomain } from '../domain/UserDomain';
import { BoxData } from './BoxData';

export interface BoardData {
  id: number;
  code: string;
  owner: UserDomain;
  width: number;
  height: number;
  state: string;
  boxes: BoxData[];
  emptyBoxes: EmptyBoxDomain[];
}
