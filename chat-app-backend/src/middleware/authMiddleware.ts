import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Authorization header is missing' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export function verifyToken(token: string): JwtPayload {
  if (!token) throw new Error('No Token Provided');
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}
