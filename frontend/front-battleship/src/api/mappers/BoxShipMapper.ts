import { ShipData } from '../data/ShipData';
import { BoxDomain } from '../domain/BoxDomain';
import { getShipType } from '../domain/ShipDomain';
import { mapShipDataToShipDomain } from './ShipMapper';

export function mapBoxShipsDomainToData(data: BoxDomain[]): ShipData[] {
  const ships: ShipData[] = [];
  
  const groupedBoxes = data.reduce(function (list, key) {
    (list[key.ship!.id + ''] = list[key.ship!.id + ''] || []).push(key);
    return list;
  }, Object.create(null));

  for (const [key, value] of Object.entries(groupedBoxes)) {
    const boxes: any = value;
    const auxShip = (boxes[0] as BoxDomain).ship!;
    const ship: ShipData = {
      type: getShipType(auxShip.shipType),
      boxes: [],
      id: auxShip.id,
    };
    boxes.forEach((d: any) => {
      const auxBox = d as BoxDomain;
      ship.boxes.push({
        touched: auxBox.touched,
        x: auxBox.x,
        y: auxBox.y,
        id: auxBox.id,
      });
    });
    ships.push(ship);
  }
  return ships;
}

export function mapBoxShipsDataToDomain(data: ShipData[]): BoxDomain[] {
  const boxes: BoxDomain[] = [];

  data.forEach((ship, i) => {
    const shipDomain = mapShipDataToShipDomain(ship);
    shipDomain.id = i;
    ship.boxes.forEach((box) => {
      boxes.push({
        touched: box.touched,
        x: box.x,
        y: box.y,
        ship: shipDomain,
      });
    });
  });

  return boxes;
}
