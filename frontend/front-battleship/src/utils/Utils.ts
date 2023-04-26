import moment from 'moment';
import { ShipType } from '../api/domain/ShipDomain';
import { BoxData } from '../api/data/BoxData';
import { FleetData } from '../pages/GameSection/Game/Game';

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

// Busca si la flota tiene alguna casilla ocupada con esas coordenadas
export const hasShip = (fleet: FleetData, x: number, y: number): [BoxData, ShipType] | undefined => {
  let result: [BoxData, ShipType] | undefined = undefined;
  if (fleet) {
    fleet.ships.forEach((ship) => {
      const filtered = ship.boxes.filter((box) => box.x === x && box.y === y);
      if (filtered && filtered.length > 0) {
        result = [filtered[0], ship.type];
        return;
      }
    });
  }
  return result;
};