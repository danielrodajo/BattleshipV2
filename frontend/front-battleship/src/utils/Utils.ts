import moment from 'moment';

export function formatDate(date: Date): string {
  let formattedDate = (moment(date)).format('DD/MM/YYYY HH:mm:ss');
  return formattedDate;
}

export function formatError(origin: string): string {
  switch (origin) {
    case 'fetchGameData': return 'No existe la partida';
    case 'fetchGameRecordsData': return 'Hubo un problema al recuperar el historial';
    default: return '';
  }
}