import moment from 'moment';

export function formatDate(date: Date): string {
  let formattedDate = (moment(date)).format('DD/MM/YYYY HH:mm:ss');
  return formattedDate;
}