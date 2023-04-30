import { createSlice } from '@reduxjs/toolkit';
import { ShipData } from '../../api/data/ShipData';
import { RootState } from '../store';

export interface PrepareGameState {
  fleet: ShipData[];
  draggingShip: ShipData | null;
  indexDirection: number;
  mouseOnBoard: boolean;
}

const initialState: PrepareGameState = {
  fleet: [],
  draggingShip: null,
  indexDirection: 1,
  mouseOnBoard: false,
};

export const prepareGameSlice = createSlice({
  name: 'prepareGameSlice',
  initialState,
  reducers: {
    removeShipFromFleet(state, action) {
      const index = state.fleet.findIndex((ship) =>
        ship.boxes.find(
          (box) =>
            box.x === action.payload.boxes[0].x &&
            box.y === action.payload.boxes[0].y
        )
      );
      if (index > -1) {
        state.fleet.splice(index, 1);
        return;
      }
    },
    replaceFleet(state, action) {
      state.fleet = action.payload;
    },
    pushFleet(state) {
      if (state.draggingShip) {
        state.fleet.push(state.draggingShip);
        return;
      }
    },
    setDraggingShip(state, action) {
      state.draggingShip = action.payload;
    },
    setDirection(state, action) {
      state.indexDirection = action.payload;
    },
    moveDirection(state, action) {
      if (action.payload > 0) {
        state.indexDirection = state.indexDirection + 1; // % directions.length;
      } else if (action.payload < 0) {
        let aux = state.indexDirection - 1; // % directions.length;
        if (aux < 0) {
          aux *= -1;
          aux += 2;
        }
        state.indexDirection = aux;
      }
    },
    setMouseOnBoard(state, action) {
      state.mouseOnBoard = action.payload;
    },
  },
});

export const {
  setDraggingShip,
  setDirection,
  moveDirection,
  replaceFleet,
  pushFleet,
  setMouseOnBoard,
  removeShipFromFleet,
} = prepareGameSlice.actions;
export const selectPrepareGameDraggingShip = (state: RootState) =>
  state.prepareGameState.draggingShip;
export const selectPrepareGameDirection = (state: RootState) =>
  state.prepareGameState.indexDirection;
export const selectPrepareGameFleet = (state: RootState) =>
  state.prepareGameState.fleet;
export const selectPrepareGameMouseOnBoard = (state: RootState) =>
  state.prepareGameState.mouseOnBoard;
export default prepareGameSlice.reducer;
