import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-ac', // Use the latest API version or the one you're comfortable with
  appInfo: {
    name: 'MomIncome PLR Vault',
    version: '0.1.0'
  }
})
