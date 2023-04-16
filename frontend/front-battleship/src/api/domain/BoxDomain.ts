import { ShipDomain } from './ShipDomain';

export interface BoxDomain {
  id?: number;
  touched: boolean;
  ship?: ShipDomain;
  x: number;
  y: number;
}
