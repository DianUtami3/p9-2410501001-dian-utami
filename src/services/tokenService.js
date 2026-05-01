import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.110.12:5000';

export const saveBackendTokens = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync('backend_access_token', accessToken);
  await SecureStore.setItemAsync('backend_refresh_token', refreshToken);
};

export const requestBackendTokens = async (uid, email) => {
  const response = await fetch(`${BASE_URL}/login-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, email }),
  });

  const data = await response.json();

  await saveBackendTokens(data.accessToken, data.refreshToken);

  return data;
};

export const rotateRefreshToken = async () => {
  const oldRefreshToken = await SecureStore.getItemAsync(
    'backend_refresh_token'
  );

  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: oldRefreshToken }),
  });

  const data = await response.json();

  await saveBackendTokens(data.accessToken, data.refreshToken);

  return data;
};