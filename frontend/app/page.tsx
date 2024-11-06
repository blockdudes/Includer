'use client'
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
// );
export default function Home() {
  return (
    <div>

    </div>
  )
}