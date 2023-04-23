export interface ShipDomain {
  id?: number;
  shipType: string;
}

export enum ShipType {
  CARRIER,
  BATTLESHIP,
  SUBMARINE,
  DESTROYER,
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
