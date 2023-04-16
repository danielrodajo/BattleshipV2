import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
export interface SpinnerState {
  show: boolean;
}

const initialState: SpinnerState = {
  show: false,
};

export const spinnerSlice = createSlice({
  name: 'spinnerSlice',
  initialState,
  reducers: {
    showSpinner: (state) => {
        state.show = true;
    },
    hideSpinner: (state) => {
        state.show = false;
    }
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export const selectShowSpinner = (state: RootState) => state.spinnerState.show;
export default spinnerSlice.reducer;