import express from 'express';
import axios from 'axios';
import { Keypair } from '@stellar/stellar-sdk';
import { db } from '../config/firebaseConfig';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: '2024-10-28.acacia',
  });

  export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  async function buffer(req: express.Request) {
    const chunks = [];
    const reader = req.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
    }
    return Buffer.concat(chunks);
  }

  async function grantAccessToUser(session: Stripe.Checkout.Session) {
    const customerEmail = session.customer_email;
    if (customerEmail) {
      console.log(`Access granted to: ${customerEmail}`);
    }
  }
  

export const createPaymentSession = async (req: express.Request, res: express.Response) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: 'price_1QHiEESF6nbQBJVio5oeaf9o',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
  
      if (!session.url) {
        res.status(500).json({ error: "Session URL is missing" });
      }
  
      console.log('Session URL:', session.url);
      res.status(200).json({ url: session.url });
  
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message || "Stripe request failed" });
    }
  };

  export const webhook = async (req: express.Request, res: express.Response) => {
    let event;
    try {
      const rawBody = await buffer(req);
      const signature = req.headers["stripe-signature"];
  
      if (!signature) {
        console.error("Missing Stripe signature");
        res.status(400).json({ error: "Missing Stripe signature" });
      }
  
      // Attempt to construct the event with the webhook secret
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature as string,
        process.env.WEBHOOK_KEY!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  
    // Process the event
    if (event && event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment successful, session ID:", session.id);
      await grantAccessToUser(session);
    }
  
    res.status(200).json({ received: true });
  }

  const stripeManager = express.Router();

  stripeManager.post('/payment', createPaymentSession);
  stripeManager.post('/webhook', webhook);
  export default stripeManager;



