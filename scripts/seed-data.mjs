import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const assets = [
  {
    title: 'How to Make Your First $1,000 Online as a Mom',
    slug: 'how-to-make-your-first-1000',
    category: 'ebook',
    description: 'A step-by-step guide to earning real income from home',
    month: 1,
    file_url: 'month1/ebook_first_1000.md',
    file_type: 'text/markdown'
  },
  {
    title: 'Profitable Mom Welcome Sequence',
    slug: 'profitable-mom-welcome-sequence',
    category: 'email',
    description: '5-day email sequence to build trust and guide subscribers',
    month: 1,
    file_url: 'month1/email_sequence_5day.md',
    file_type: 'text/markdown'
  },
  {
    title: 'My Profitable Mom Roadmap',
    slug: 'my-profitable-mom-roadmap',
    category: 'workbook',
    description: 'A done-for-you workbook to plan your online income journey',
    month: 1,
    file_url: 'month1/workbook_roadmap.md',
    file_type: 'text/markdown'
  },
  {
    title: '20 Money-Making Prompts for Moms',
    slug: '20-money-making-prompts',
    category: 'prompts',
    description: 'ChatGPT prompt pack for creating content and planning your business',
    month: 1,
    file_url: 'month1/chatgpt_prompt_pack.md',
    file_type: 'text/markdown'
  },
  {
    title: 'Social Media Copy/Paste Pack',
    slug: 'social-media-copy-paste-pack',
    category: 'social',
    description: '10 ready-to-post social media posts for mom entrepreneurs',
    month: 1,
    file_url: 'month1/social_media_posts.md',
    file_type: 'text/markdown'
  },
  {
    title: 'Reel Script Pack for Mom Entrepreneurs',
    slug: 'reel-script-pack',
    category: 'reels',
    description: '5 short-form video scripts for Instagram Reels and TikTok',
    month: 1,
    file_url: 'month1/reel_scripts.md',
    file_type: 'text/markdown'
  },
  {
    title: "Mom's Guide to Online Income — Module 1",
    slug: 'moms-guide-module-1',
    category: 'course',
    description: 'Finding Your Money-Making Path foundation module',
    month: 1,
    file_url: 'month1/course_module1.md',
    file_type: 'text/markdown'
  }
]

async function seedData() {
  console.log('Seeding content_assets...')
  
  for (const asset of assets) {
    console.log(`Upserting asset: ${asset.slug}`)
    const { error } = await supabase
      .from('content_assets')
      .upsert(asset, { onConflict: 'slug' })

    if (error) {
      console.error(`Error upserting ${asset.slug}:`, error.message)
    } else {
      console.log(`Successfully upserted ${asset.slug}`)
    }
  }
}

seedData()
