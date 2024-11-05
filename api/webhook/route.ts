import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-10-28.acacia",
});

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    console.log("Payment successful, session ID:", session.id);
    await grantAccessToUser(session);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Example function to grant access to the user
async function grantAccessToUser(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email;
  if (customerEmail) {
    console.log(`Access granted to: ${customerEmail}`);
  }
}
