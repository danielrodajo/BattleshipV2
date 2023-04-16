import { BoardData } from '../data/BoardData';
import { BoardDomain } from '../domain/BoardDomain';
import { mapBoxDataToBoxDomain } from './BoxMapper';
import { mapUserDataToUserDomain } from './UserMapper';

export function mapBoardDataToBoardDomain(dto: BoardData): BoardDomain {
  return {
    id: dto.id,
    code: dto.code,
    width: dto.width,
    height: dto.height,
    state: dto.state,
    owner: mapUserDataToUserDomain(dto.owner),
    boxes: dto.boxes.map(box => mapBoxDataToBoxDomain(box)),
    emptyBoxes: dto.emptyBoxes
  };
}
