import jwt from 'jsonwebtoken';
import {SECRET_KEY} from '$env/static/private';

const {TokenExpiredError} = jwt;

export function generateToken(): string {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (60 * 2),
  }

  return jwt.sign(payload, SECRET_KEY);
}

export function verifyToken(token: string): [boolean, string] {
  try {
    const data = jwt.verify(token, SECRET_KEY);
    if (typeof data !== "object") {
      return [false, "Invalid token."];
    }

    return [true, ""];
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return [false, "Token expired."];
    } else {
      return [false, "Invalid token."];
    }
  }
}