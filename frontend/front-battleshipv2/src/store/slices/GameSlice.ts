import { createSlice } from '@reduxjs/toolkit';

export interface GameState {}

const initialState: GameState = {};

export const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {},
});
export default gameSlice.reducer;
