import { RecordData } from '../data/RecordData';
import { RecordDomain } from '../domain/RecordDomain';
import { letters } from '../../utils/Constants';

export function mapRecordDomainToData(domain: RecordDomain[]): RecordData[] {
  const data: RecordData[] = domain.map((record) => {
    return {
      id: record.id,
      game: record.game,
      player: record.player,
      x: letters[record.x],
      y: record.y + 1,
      type: record.type,
      createdAt: record.createdAt
    };
  });
  return data.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
  });
}
