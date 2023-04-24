import { ENDPOINT_REFRESH_TOKEN, ENDPOINT_SIGNIN } from '../../utils/Endpoints';
import client from '../client';
import { AuthenticationResponse } from '../domain/responses/AuthenticationResponse';

export const fetchSignIn = async (
  user: string, password: string
): Promise<any> => {
  let response;
    try {
      response = await client.post(ENDPOINT_SIGNIN, {
        email: user,
        password: password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response.status === 401) return error.response;
    }
    return response;
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
