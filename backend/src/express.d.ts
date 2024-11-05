// types/express.d.ts
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can specify the user type if you know the structure, e.g., `user?: { email: string; publicKey: string }`
    }
  }
}
