import { BoxData } from '../data/BoxData';
import { BoxDomain } from '../domain/BoxDomain';

export function mapBoxDataToBoxDomain(dto: BoxData): BoxDomain {
  return {
    id: dto.id,
    x: dto.x,
    y: dto.y,
    touched: dto.touched,
    //ship : mapShipDtoToShipDomain(dto.ship),
  };
}
