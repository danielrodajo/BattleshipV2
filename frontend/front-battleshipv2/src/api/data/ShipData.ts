import { ShipType } from '../domain/ShipDomain';
import { BoxData } from './BoxData';

export interface ShipData {
  id?: number;
  type: ShipType;
  boxes: BoxData[];
}

