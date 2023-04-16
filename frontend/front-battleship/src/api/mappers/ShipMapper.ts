import { ShipData } from '../data/ShipData';
import { ShipType } from '../domain/ShipDomain';
import { ShipDomain } from '../domain/ShipDomain';

export function mapShipDataToShipDomain(dto: ShipData): ShipDomain {
  return {
    id: dto.id,
    shipType: ShipType[dto.type],
  };
}
