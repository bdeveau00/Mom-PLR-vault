import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { execSync } from 'node:child_process'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const assets = [
  { file: 'ebook_first_1000.md', slug: 'how-to-make-your-first-1000' },
  { file: 'email_sequence_5day.md', slug: 'profitable-mom-welcome-sequence' },
  { file: 'workbook_roadmap.md', slug: 'my-profitable-mom-roadmap' },
  { file: 'chatgpt_prompt_pack.md', slug: '20-money-making-prompts' },
  { file: 'social_media_posts.md', slug: 'social-media-copy-paste-pack' },
  { file: 'reel_scripts.md', slug: 'reel-script-pack' },
  { file: 'course_module1.md', slug: 'moms-guide-module-1' },
]

const sharedDir = '/home/team/shared/'
const pdfPrefix = 'month1-pdf/'

async function convertAndUpload() {
  console.log('Starting conversion and upload to month1-pdf/...')

  // Create bucket if it doesn't exist
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('plr-assets', {
    public: false,
    allowedMimeTypes: ['text/markdown', 'application/pdf'],
    fileSizeLimit: 10485760
  })

  if (bucketError && bucketError.message !== 'Bucket already exists') {
    console.error('Error with bucket:', bucketError.message)
  }

  for (const asset of assets) {
    const mdPath = path.join(sharedDir, asset.file)
    const pdfFile = asset.file.replace('.md', '.pdf')
    const pdfLocalPath = path.join(sharedDir, pdfFile)
    const pdfStoragePath = pdfPrefix + pdfFile

    if (!fs.existsSync(mdPath)) {
      console.warn(`Markdown file not found: ${mdPath}`)
      continue
    }

    // Convert to PDF using md-to-pdf (since markdown-pdf failed)
    console.log(`Converting ${asset.file} to PDF...`)
    try {
      execSync(`npx md-to-pdf ${mdPath}`, { stdio: 'inherit' })
      console.log(`Successfully converted to ${pdfLocalPath}`)
    } catch (err) {
      console.error(`Error converting ${asset.file}:`, err.message)
      continue
    }

    // Upload PDF
    const pdfContent = fs.readFileSync(pdfLocalPath)
    
    console.log(`Uploading ${pdfFile} to ${pdfStoragePath}...`)
    const { error: uploadError } = await supabase.storage
      .from('plr-assets')
      .upload(pdfStoragePath, pdfContent, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error(`Error uploading ${pdfFile}:`, uploadError.message)
      continue
    }
    
    console.log(`Successfully uploaded ${pdfFile}`)

    // Update database record
    console.log(`Updating DB record for ${asset.slug}...`)
    const { error: dbError } = await supabase
      .from('content_assets')
      .update({ file_url_pdf: pdfStoragePath })
      .eq('slug', asset.slug)

    if (dbError) {
      console.error(`Error updating DB for ${asset.slug}:`, dbError.message)
      console.log('Note: Ensure the file_url_pdf column has been added to the content_assets table via Supabase SQL Editor.')
    } else {
      console.log(`Successfully updated DB for ${asset.slug}`)
    }
  }
}

convertAndUpload()
