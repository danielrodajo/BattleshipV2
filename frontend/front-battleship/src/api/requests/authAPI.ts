import {
  ENDPOINT_GOOGLE_SIGNIN,
  ENDPOINT_REFRESH_TOKEN,
  ENDPOINT_SIGNIN,
} from '../../utils/Endpoints';
import client from '../client';
import { AuthenticationResponse } from '../domain/responses/AuthenticationResponse';

export const googleSignIn = async (code: string): Promise<any> => {
  const response = await client.post<AuthenticationResponse>(
    ENDPOINT_GOOGLE_SIGNIN,
    {
      code,
    }
  );
  return response.data;
};

export const fetchSignIn = async (
  user: string,
  password: string
): Promise<any> => {
  try {
    const response = await client.post<AuthenticationResponse>(
      ENDPOINT_SIGNIN,
      {
        email: user,
        password: password,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response.status === 401) return error.response;
    throw new Error(error);
  }
};

export const fetchRefreshToken = async (
  rToken: string
): Promise<AuthenticationResponse | null> => {
  try {
    const response = await client.post<AuthenticationResponse>(
      ENDPOINT_REFRESH_TOKEN,
      {
        token: rToken,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
