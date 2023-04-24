import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface I18nState {
  lang: string;
}

const initialState: I18nState = {
  lang: 'es',
};

export const i18nSlice = createSlice({
  name: 'i18nSlice',
  initialState,
  reducers: {
    setLang(state, action) {
      state.lang = action.payload;
    },
  },
});

export const { setLang } = i18nSlice.actions;
export const selectI18nLang = (state: RootState) => state.i18nState.lang;
export default i18nSlice.reducer;
