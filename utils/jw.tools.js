import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET || 'Super Secret Value');
const expTime = process.env.TOKEN_EXPIRATION || '5m';

export const createToken = async (id) => {
  console.log('createToken');
  return await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(expTime)
    .sign(secret);
}

export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return false;
  }
}

