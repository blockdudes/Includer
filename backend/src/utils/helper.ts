import express from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      res.status(401).send({ message: 'Access token is missing' });
      return; 
    }
  
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).send({ message: 'Invalid or expired token' });
        return; 
      }
  
      (req as any).user = user;
      next();
    });
  }