import { stripe } from '@/utils/stripe/config'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Use service role key for webhook to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = (await headers()).get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const session = event.data.object as any

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata.userId
    const planType = session.metadata.planType
    const subscriptionId = session.subscription as string
    
    // Update or insert subscription
    const subscriptionData: any = {
      id: planType === 'lifetime' ? `lifetime_${userId}` : subscriptionId,
      user_id: userId,
      status: 'active',
      plan_type: planType,
      stripe_subscription_id: subscriptionId,
    }

    if (planType === 'monthly') {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
      subscriptionData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString()
      subscriptionData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString()
    }

    await supabaseAdmin
      .from('subscriptions')
      .upsert(subscriptionData)
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any
    
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
