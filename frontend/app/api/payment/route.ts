import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { quantity } = await req.json();
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
      apiVersion: '2024-10-28.acacia',
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Use the exact Price ID of the product
          price: 'price_1QHorrSF6nbQBJViGdVEjNtY',
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/failed`,
    });

    if (!session.url) {
      // If session URL is missing, return an error response
      return NextResponse.json({ error: "Session URL is missing" }, { status: 500 });
    }

    // console.log('Redirecting to:', session.url);
    // return NextResponse.redirect(session.url, {
    //     status: 303,
    // });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message || "Stripe request failed" }, { status: 500 });
  }
}