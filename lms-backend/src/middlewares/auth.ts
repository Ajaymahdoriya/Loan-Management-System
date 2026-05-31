import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request { user?: any; }

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role === 'Admin') return next();
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Unauthorized. Requires one of: ${allowedRoles.join(', ')}` });
    }
    next();
  };
};