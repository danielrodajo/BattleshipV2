import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GameDomain, GameState } from '../../api/domain/GameDomain';
import { ShipData } from '../../api/data/ShipData';
import { RootState } from '../store';
import { fetchGame } from '../../api/requests/gameAPI';
import { mapBoxShipsDomainToData } from '../../api/mappers/BoxShipMapper';
import { FleetData } from '../../pages/GameSection/Game/Game';
import { fetchGameRecords } from '../../api/requests/recordAPI';
import { mapRecordDomainToData } from '../../api/mappers/RecordMapper';
import { RecordData } from '../../api/data/RecordData';
import { BoardState } from '../../api/domain/BoardDomain';

export interface GameRState {
  game: GameDomain | null;
  myFleet: FleetData;
  opponentFleet: FleetData;
  isMyTurn: boolean | null;
  finishedStatus: string | null;
  opponentAlive: boolean;
  records: RecordData[];
  loading: boolean;
  error: {
    origin: string;
    data: any;
  } | null;
}

const initialState: GameRState = {
  game: null,
  myFleet: {
    ships: [],
    emptyBoxes: [],
  },
  opponentFleet: {
    ships: [],
    emptyBoxes: [],
  },
  isMyTurn: null,
  finishedStatus: null,
  opponentAlive: true,
  records: [],
  loading: false,
  error: null,
};

export const fetchGameData = createAsyncThunk(
  'gameSlice/fetchGameData',
  async (data: GameFinished) => {
    const fleetData = await fetchGame(data.data);
    const response: GameFinished = {
      data: fleetData,
      showFinished: data.showFinished,
    };
    return response;
  }
);

export interface GameFinished {
  data: any;
  showFinished: boolean;
}

export const fetchGameRecordsData = createAsyncThunk(
  'gameSlice/fetchGameRecordsData',
  async (gameCode: string) => {
    const recordsData = await fetchGameRecords(gameCode);
    return recordsData;
  }
);

const gameFinished = (localGame: GameDomain | null): boolean => {
  if (localGame) {
    const stateResponse: number = +GameState[localGame.state];
    return stateResponse === GameState.FINALIZED;
  }
  return false;
};

export const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    addGameRecord(state, action) {
      state.records = state.records.concat(action.payload);
    },
    hitMyBox(state, action) {
      const shipAux: ShipData = mapBoxShipsDomainToData([action.payload])[0];
      const ship = state.myFleet.ships.find((s) => s.id === shipAux.id);
      if (ship) {
        const box = ship.boxes.find((b) => b.id === shipAux.boxes[0].id);
        if (box) {
          box.touched = true;
          return state;
        }
      }
    },
    hitMissed(state, action) {
      state.myFleet.emptyBoxes.push(action.payload);
      state.myFleet = { ...state.myFleet };
    },
    updateMyFleet(state, action) {
      state.myFleet = action.payload;
    },
    updateOpponentFleet(state, action) {
      state.opponentFleet = action.payload;
    },
    hitOpponentBox(state, action) {
      const shipAux: ShipData = mapBoxShipsDomainToData([action.payload])[0];
      const ship = state.opponentFleet.ships.find(
        (s) => s.id === action.payload.id
      );
      if (ship) {
        ship.boxes = ship.boxes.concat(shipAux.boxes);
      } else {
        state.opponentFleet.ships.push(shipAux);
      }
      return state;
    },
    hitOpponentMissed(state, action) {
      state.opponentFleet.emptyBoxes.push(action.payload);
      state.opponentFleet = { ...state.opponentFleet };
    },
    updateIsMyTurn(state, action) {
      state.isMyTurn = action.payload;
    },
    updateFinishedStatus(state, action) {
      state.finishedStatus = action.payload;
    },
    updateOpponentAlive(state, action) {
      state.opponentAlive = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameData.fulfilled, (state, action) => {
        const game = action.payload.data;
        state.game = game;
        if (gameFinished(game)) {
          state.isMyTurn = null;
          if (action.payload.showFinished) {
            state.finishedStatus =
              game.board1.state === BoardState[BoardState.WIN]
                ? BoardState[BoardState.WIN]
                : BoardState[BoardState.LOSE];
          }
        } else {
          state.finishedStatus = null;
          state.isMyTurn = game.turn === game.board1.id;
        }
        state.myFleet = {
          ships: mapBoxShipsDomainToData(game.board1.boxes),
          emptyBoxes: game.board1.emptyBoxes,
        };
        state.opponentFleet = {
          ships: mapBoxShipsDomainToData(game.board2.boxes),
          emptyBoxes: game.board2.emptyBoxes,
        };
        state.loading = false;
      })
      .addCase(fetchGameData.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          origin: 'fetchGameData',
          data: action.error,
        };
      })
      .addCase(fetchGameRecordsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameRecordsData.fulfilled, (state, action) => {
        state.records = mapRecordDomainToData(action.payload);
        state.loading = false;
      })
      .addCase(fetchGameRecordsData.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          origin: 'fetchGameRecordsData',
          data: action.error,
        };
      });
  },
});

export const {
  addGameRecord,
  updateMyFleet,
  updateOpponentFleet,
  hitMyBox,
  hitMissed,
  hitOpponentBox,
  hitOpponentMissed,
  updateIsMyTurn,
  updateFinishedStatus,
  updateOpponentAlive,
  setLoading,
  setError,
} = gameSlice.actions;
export const selectGame = (state: RootState) => state.gameState.game;
export const selectGameMyFleet = (state: RootState) => state.gameState.myFleet;
export const selectGameOpponentFleet = (state: RootState) =>
  state.gameState.opponentFleet;
export const selectGameIsMyTurn = (state: RootState) =>
  state.gameState.isMyTurn;
export const selectGameFinishedStatus = (state: RootState) =>
  state.gameState.finishedStatus;
export const selectGameOpponentAlive = (state: RootState) =>
  state.gameState.opponentAlive;
export const selectGameRecords = (state: RootState) => state.gameState.records;
export const selectGameLoading = (state: RootState) => state.gameState.loading;
export const selectGameError = (state: RootState) => state.gameState.error;
export default gameSlice.reducer;
