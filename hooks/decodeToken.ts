// utils/decodeToken.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export function decodeJWT(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Invalid JWT Token:', error);
    return null;
  }
}
