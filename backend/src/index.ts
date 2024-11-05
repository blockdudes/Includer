import cors from 'cors';
import dotenv from 'dotenv';
import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import registeryManager from './routes/RegisteryManager';
import transactionManager from './routes/TransactionManager';
import stripeManager from './routes/StripeManager';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// creating routes
app.use("/api", registeryManager);
app.use("/api", transactionManager);
// app.use("/api", stripeManager);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
app.use(errorHandler);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
