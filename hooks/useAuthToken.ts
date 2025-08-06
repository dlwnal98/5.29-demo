// hooks/useAuthToken.ts
'use client';

import { useState, useEffect } from 'react';

export const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setAccessToken(token);
  }, []);

  const saveAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
    setAccessToken(token);
  };

  const clearAccessToken = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
  };

  return {
    accessToken,
    setAccessToken: saveAccessToken,
    clearAccessToken,
  };
};
