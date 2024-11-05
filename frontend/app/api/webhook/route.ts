import { Address, Contract, Networks, SorobanRpc, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
import { Keypair } from "@stellar/typescript-wallet-sdk";
import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-10-28.acacia",
});

const serverUrl = "https://soroban-testnet.stellar.org:443";
const server = new SorobanRpc.Server(serverUrl);

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getUserByEmail(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUserByEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const user = await response.json();
  console.log("user", user)
  return user.publicKey;
}

export async function mintTokens(amount: string , email: string) {

  const toAddress = await getUserByEmail(email);

  const options =  {
      contractId :'CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V',
      sourceAccount :'SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN',
      rpcUrl :'https://soroban-testnet.stellar.org:443',
      networkPassphrase :'Test SDF Network ; September 2015',
  } 

  const command = `stellar contract invoke \
      --id ${options.contractId} \
      --source-account ${options.sourceAccount} \
      --rpc-url "${options.rpcUrl}" \
      --network-passphrase "${options.networkPassphrase}" \
      -- mint \
      --to ${toAddress} \
      --amount ${amount};`

  return new Promise((resolve, reject) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
          if (error) {
              console.error(`Error: ${error}`);
              reject(error);
              return;
          }
          if (stderr) {
              console.error(`stderr: ${stderr}`);
          }
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
      });
  });
}
async function buffer(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  console.log("Webhook Secret:", process.env.NEXT_PUBLIC_WEBHOOK_KEY); // Debug line

  let event;
  try {
    const rawBody = await buffer(req);
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    // Attempt to construct the event with the webhook secret
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.NEXT_PUBLIC_WEBHOOK_KEY!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Process the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Payment successful, session ID:", session);
    await grantAccessToUser(session);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Example function to grant access to the user
async function grantAccessToUser(session: Stripe.Checkout.Session) {
  const paymentStatus = session.payment_status;
  const email = session.customer_details?.email;
  const amount = BigInt(10 * 10 ** 6);
  
  if (paymentStatus === "paid") {
    console.log(`Access granted to: ${paymentStatus}`);
    email && await mintTokens(amount.toString(), email);
  }
}
