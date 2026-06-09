import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import markdownpdf from 'markdown-pdf'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const assets = [
  'ebook_first_1000.md',
  'email_sequence_5day.md',
  'workbook_roadmap.md',
  'chatgpt_prompt_pack.md',
  'social_media_posts.md',
  'reel_scripts.md',
  'course_module1.md'
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

  for (const file of assets) {
    const mdPath = path.join(sharedDir, file)
    const pdfFile = file.replace('.md', '.pdf')
    const pdfLocalPath = path.join(sharedDir, pdfFile)
    const pdfStoragePath = pdfPrefix + pdfFile

    if (!fs.existsSync(mdPath)) {
      console.warn(`Markdown file not found: ${mdPath}`)
      continue
    }

    // Convert to PDF
    console.log(`Converting ${file} to PDF...`)
    await new Promise((resolve, reject) => {
      markdownpdf()
        .from(mdPath)
        .to(pdfLocalPath, function () {
          console.log(`Successfully converted to ${pdfLocalPath}`)
          resolve(true)
        })
    })

    // Upload PDF
    const pdfContent = fs.readFileSync(pdfLocalPath)
    
    console.log(`Uploading ${pdfFile} to ${pdfStoragePath}...`)
    const { error } = await supabase.storage
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
