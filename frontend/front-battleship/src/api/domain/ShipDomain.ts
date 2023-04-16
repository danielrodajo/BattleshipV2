export interface ShipDomain {
  id?: number;
  shipType: string;
}

export enum ShipType {
  CARRIER = 5,
  BATTLESHIP = 4,
  SUBMARINE = 3,
  DESTROYER = 2,
}

export function getShipType(name: string): ShipType {
  if (name === 'CARRIER') {
    return ShipType.CARRIER;
  }
  if (name === 'BATTLESHIP') {
    return ShipType.BATTLESHIP;
  }
  if (name === 'SUBMARINE') {
    return ShipType.SUBMARINE;
  }
  return ShipType.DESTROYER;
}
