import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia' as any, // Use the latest API version
  appInfo: {
    name: 'MomIncome PLR Vault',
    version: '0.1.0'
  }
})
