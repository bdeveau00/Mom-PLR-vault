import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { assetId, fileUrl } = await request.json()

    if (!assetId || !fileUrl) {
      return NextResponse.json({ error: 'Asset ID and file URL are required' }, { status: 400 })
    }

    // 1. Verify authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify access (subscription)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, plan_type')
      .eq('user_id', user.id)
      .single()

    const hasAccess = subscription?.status === 'active' || subscription?.plan_type === 'lifetime'

    if (!hasAccess) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
    }

    // 3. Create Admin Client for storage and DB tracking
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 4. Record download
    const { error: trackError } = await supabaseAdmin
      .from('downloads')
      .insert({
        user_id: user.id,
        asset_id: assetId
      })

    if (trackError) {
      console.warn('Failed to track download:', trackError.message)
    }

    // 5. Generate signed URL
    const { data, error: urlError } = await supabaseAdmin
      .storage
      .from('plr-assets')
      .createSignedUrl(fileUrl, 60)

    if (urlError) {
      throw urlError
    }

    return NextResponse.json({ signedUrl: data.signedUrl })
  } catch (error: any) {
    console.error('Download API error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
