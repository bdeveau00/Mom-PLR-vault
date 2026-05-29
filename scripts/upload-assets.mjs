import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
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
  { file: 'ebook_first_1000.md', path: 'month1/ebook_first_1000.md' },
  { file: 'email_sequence_5day.md', path: 'month1/email_sequence_5day.md' },
  { file: 'workbook_roadmap.md', path: 'month1/workbook_roadmap.md' },
  { file: 'chatgpt_prompt_pack.md', path: 'month1/chatgpt_prompt_pack.md' },
  { file: 'social_media_posts.md', path: 'month1/social_media_posts.md' },
  { file: 'reel_scripts.md', path: 'month1/reel_scripts.md' },
  { file: 'course_module1.md', path: 'month1/course_module1.md' },
]

const sharedDir = '/home/team/shared/'

async function uploadAssets() {
  console.log('Starting upload to bucket "plr-assets"...')

  // Create bucket if it doesn't exist
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('plr-assets', {
    public: false,
    allowedMimeTypes: ['text/markdown'],
    fileSizeLimit: 10485760 // 10MB
  })

  if (bucketError && bucketError.message !== 'Bucket already exists') {
    console.error('Error creating bucket:', bucketError.message)
    // Continue anyway in case it exists but error message is different
  } else {
    console.log('Bucket "plr-assets" is ready.')
  }

  for (const asset of assets) {
    const filePath = path.join(sharedDir, asset.file)
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`)
      continue
    }

    const fileContent = fs.readFileSync(filePath)
    
    console.log(`Uploading ${asset.file} to ${asset.path}...`)
    const { data, error } = await supabase.storage
      .from('plr-assets')
      .upload(asset.path, fileContent, {
        contentType: 'text/markdown',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${asset.file}:`, error.message)
    } else {
      console.log(`Successfully uploaded ${asset.file}`)
    }
  }
}

uploadAssets()
