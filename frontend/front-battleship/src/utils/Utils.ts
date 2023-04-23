import moment from 'moment';

export const formatDate = (date: Date): string => {
  let formattedDate = moment(date).format('DD/MM/YYYY HH:mm:ss');
  return formattedDate;
};

export const formatError = (origin: string): string => {
  switch (origin) {
    case 'fetchGameData':
      return 'No existe la partida';
    case 'fetchGameRecordsData':
      return 'Hubo un problema al recuperar el historial';
    case 'already_exists_nickname':
      return 'Ya existe un usuario con este apodo';
    case 'already_exists_email':
      return 'Ya existe un usuario con este email';
    default:
      return 'Ha surgido un error inesperado';
  }
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
