import express from 'express';
import axios from 'axios';
import { Keypair } from '@stellar/stellar-sdk';
import { db } from '../config/firebaseConfig';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../utils/helper';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  publicKey: string;
  privateKey: string;
  history?: any;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  publicKey: string;
}

export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password, imageUrl=null } = req.body;
    const stellarAccount = Keypair.random();
    const docRef = db.collection('users').doc(stellarAccount.publicKey());
    const newUser: User = {
      id: stellarAccount.publicKey(),
      name,
      email,
      password, 
      imageUrl,
      publicKey: stellarAccount.publicKey(),
      privateKey: stellarAccount.secret(),
    };

    await docRef.set(newUser);
    res.status(200).send({ message: 'User registered successfully', publicKey: stellarAccount.publicKey() });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
}

export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: 'Email and password are required' });
      return;
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    let userData: User | null = null;
    snapshot.forEach(doc => {
      const data = doc.data() as User;
      userData = { ...data, id: doc.id };
    });

    if (!userData || !(userData as User).password || (userData as User).password !== password) {
      res.status(401).send({ message: 'Invalid password' });
      return;
    }

    const token = jwt.sign(
      { email: (userData as User).email, publicKey: (userData as User).publicKey },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).send({ message: 'Login failed', error: (error as Error).message });
  }
};


export const getUserByEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = (req as any).user;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
      res.status(404).send({ message: 'No matching documents.' });
      return;
    }

    let userData: UserResponse | null = null;
    snapshot.forEach(doc => {
      const data = doc.data() as User;
      userData = {
        id: doc.id,
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        publicKey: data.publicKey,
      };
    });

    if (!userData) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve user', error: (error as Error).message });
  }
};

export async function recordTransaction(email: string, transactionType: string, amount: number): Promise<void> {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();

  if (snapshot.empty) {
      console.log('No such user!');
      return;
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data() as User;

  const currentTransactions = userData.history || [];
  currentTransactions.push({ type: transactionType, amount, timestamp: new Date().toISOString() });

  await userDoc.ref.update({
      history: currentTransactions
  });
}

const registeryManager = express.Router();

registeryManager.post('/registerUser', registerUser);
registeryManager.post('/loginUser', loginUser);
registeryManager.get('/getUserByEmail', authenticateToken, getUserByEmail);
export default registeryManager;