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
  { file: 'ebook_first_1000.md', path: 'month1/ebook_first_1000.md' },
  { file: 'email_sequence_5day.md', path: 'month1/email_sequence_5day.md' },
  { file: 'workbook_roadmap.md', path: 'month1/workbook_roadmap.md' },
  { file: 'chatgpt_prompt_pack.md', path: 'month1/chatgpt_prompt_pack.md' },
  { file: 'social_media_posts.md', path: 'month1/social_media_posts.md' },
  { file: 'reel_scripts.md', path: 'month1/reel_scripts.md' },
  { file: 'course_module1.md', path: 'month1/course_module1.md' },
]

const sharedDir = '/home/team/shared/'

async function convertAndUpload() {
  console.log('Starting conversion and upload...')

  // Update bucket to allow PDFs
  console.log('Updating bucket configuration...')
  const { error: updateError } = await supabase.storage.updateBucket('plr-assets', {
    public: false,
    allowedMimeTypes: ['text/markdown', 'application/pdf'],
    fileSizeLimit: 10485760
  })

  if (updateError) {
    console.warn('Warning: Could not update bucket config (maybe no permission or already set):', updateError.message)
  }

  for (const asset of assets) {
    const mdPath = path.join(sharedDir, asset.file)
    const pdfFile = asset.file.replace('.md', '.pdf')
    const pdfLocalPath = path.join(sharedDir, pdfFile)
    const pdfStoragePath = asset.path.replace('.md', '.pdf')

    if (!fs.existsSync(mdPath)) {
      console.warn(`Markdown file not found: ${mdPath}`)
      continue
    }

    // Convert to PDF
    console.log(`Converting ${asset.file} to PDF...`)
    try {
      execSync(`npx md-to-pdf ${mdPath}`, { stdio: 'inherit' })
      console.log(`Successfully converted to ${pdfLocalPath}`)
    } catch (err) {
      console.error(`Error converting ${asset.file}:`, err.message)
      continue
    }

    // Upload PDF
    if (!fs.existsSync(pdfLocalPath)) {
      console.error(`PDF file not found after conversion: ${pdfLocalPath}`)
      continue
    }

    const pdfContent = fs.readFileSync(pdfLocalPath)
    
    console.log(`Uploading ${pdfFile} to ${pdfStoragePath}...`)
    const { data, error } = await supabase.storage
      .from('plr-assets')
      .upload(pdfStoragePath, pdfContent, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${pdfFile}:`, error.message)
    } else {
      console.log(`Successfully uploaded ${pdfFile}`)
    }
  }
}

convertAndUpload()
