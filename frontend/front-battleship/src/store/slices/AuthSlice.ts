import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import client from '../../api/client';
import {
  ENDPOINT_SIGNIN,
  ENDPOINT_SIGNUP,
  ENDPOINT_USER_DATA,
} from '../../utils/Endpoints';
import { UserDomain } from '../../api/domain/UserDomain';

export interface AuthState {
  isLoggedIn: boolean;
  token: string | undefined;
  refreshToken: string | undefined;
  signInError: string | undefined;
  signUpError: string | undefined;
  status: string | undefined;
  user: UserDomain | undefined;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: undefined,
  refreshToken: undefined,
  signInError: undefined,
  signUpError: undefined,
  status: undefined,
  user: undefined,
};

export const authSignIn = createAsyncThunk(
  'auth/signin',
  async (payload: any) => {
    let response;
    try {
      response = await client.post(ENDPOINT_SIGNIN, {
        email: payload.username,
        password: payload.password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.status === 401) return error.response;
    }
    return response;
  }
);

export const authSignUp = createAsyncThunk(
  'auth/signup',
  async (payload: any) => {
    let response;
    try {
      response = await client.post(ENDPOINT_SIGNUP, {
        name: payload.name,
        firstsurname: payload.firstsurname,
        secondsurname: payload.secondsurname,
        email: payload.email,
        password: payload.password,
        nickname: payload.nickname
      });
      return response.data;
    } catch (error: any) {
      if (error.response.status === 409) return error.response;
    }
    return response;
  }
);
export const getUserData = createAsyncThunk('auth/userdata', async () => {
  const response = await client.get(ENDPOINT_USER_DATA);
  return response.data;
});

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    signOut: (state) => {
      state.isLoggedIn = false;
      state.token = undefined;
      state.refreshToken = undefined;
      state.status = undefined;
      state.signInError = undefined;
      state.signUpError = undefined;
      state.user = undefined;
    },
    refreshToken: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authSignIn.pending, (state) => {
        state.status = 'loading';
        state.signInError = undefined;
      })
      .addCase(authSignIn.fulfilled, (state, action) => {
        if (action.payload?.status === 401) {
          state.status = 'failed';
          state.signInError = 'Credenciales incorrectas';
        } else {
          state.status = 'succeeded';
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(authSignIn.rejected, (state) => {
        state.status = 'failed';
        state.signInError =
          'Ha surgido un error inesperado. Por favor, vuelva a intentarlo más tarde';
      })
      .addCase(authSignUp.pending, (state) => {
        state.status = 'loading';
        state.signUpError = undefined;
      })
      .addCase(authSignUp.fulfilled, (state, action) => {
        if (action.payload?.status === 409) {
          state.status = 'failed';
          state.signUpError = action.payload.data;
        } else {
          state.status = 'succeeded';
        }
      })
      .addCase(authSignUp.rejected, (state) => {
        state.status = 'failed';
        state.signUpError =
          'Ha surgido un error inesperado. Por favor, vuelva a intentarlo más tarde';
      })
      .addCase(getUserData.pending, (state) => {
        state.status = 'loading';
        state.user = undefined;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          name: action.payload.name,
          firstsurname: action.payload.firstsurname,
          secondsurname: action.payload.secondsurname,
          email: action.payload.email,
          id: action.payload.id,
          nickname: action.payload.nickname
        };
        state.isLoggedIn = true;
      })
      .addCase(getUserData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { signOut, refreshToken } = authSlice.actions;
export const selectUserData = (state: RootState) => state.authState.user;
export const selectLoggedIn = (state: RootState) => state.authState.isLoggedIn;
export const selectAuthToken = (state: RootState) => state.authState.token;
export const selectAuthRefreshToken = (state: RootState) =>
  state.authState.refreshToken;
export const selectAuthStatus = (state: RootState) => state.authState.status;
export const selectSignInError = (state: RootState) =>
  state.authState.signInError;
export const selectSignUpError = (state: RootState) =>
  state.authState.signUpError;
export default authSlice.reducer;
