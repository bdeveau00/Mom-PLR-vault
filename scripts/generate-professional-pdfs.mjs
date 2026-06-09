import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'
import { marked } from 'marked'

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
const proPdfDir = '/home/team/shared/pro-pdfs/'
const templatePath = 'scripts/pdf-gen/templates/base.html'

async function generatePDFs() {
  console.log('Starting professional PDF generation...')

  try {
    if (!fs.existsSync(proPdfDir)) {
      fs.mkdirSync(proPdfDir, { recursive: true })
    }

    console.log('Reading template...')
    const template = fs.readFileSync(templatePath, 'utf-8')
    
    console.log('Launching browser...')
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    console.log('Browser launched.')

    for (const asset of assets) {
      console.log(`Processing ${asset.file}...`)
      const mdPath = path.join(sharedDir, asset.file)
      if (!fs.existsSync(mdPath)) {
        console.warn(`Markdown file not found: ${mdPath}`)
        continue
      }

      let mdContent = fs.readFileSync(mdPath, 'utf-8')
      
      // Extract metadata
      const titleMatch = mdContent.match(/^# (.*)/m)
      const subtitleMatch = mdContent.match(/^\*\*(.*)\*\*/m)
      const authorMatch = mdContent.match(/By (\[INSERT .*\])/m)

      const title = titleMatch ? titleMatch[1] : 'Ebook'
      const subtitle = subtitleMatch ? subtitleMatch[1] : ''
      const author = authorMatch ? `<span class="placeholder">${authorMatch[1]}</span>` : '<span class="placeholder">[YOUR NAME]</span>'

      console.log(`Title: ${title}`)

      // Style [INSERT] placeholders in MD content
      mdContent = mdContent.replace(/\[INSERT ([^\]]+)\]/g, '<span class="placeholder">[INSERT $1]</span>')

      const htmlContent = marked.parse(mdContent)

      // Inject into template
      let finalHtml = template
        .replace('{{title}}', title)
        .replace('{{title}}', title) // Cover title
        .replace('{{subtitle}}', subtitle)
        .replace('{{author}}', author)
        .replace('{{{content}}}', htmlContent)

      const page = await browser.newPage()
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' })

      const pdfPath = path.join(proPdfDir, asset.file.replace('.md', '.pdf'))
      
      console.log(`Generating PDF for ${asset.file}...`)
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1cm',
          bottom: '2cm',
          left: '1cm',
          right: '1cm'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-family: 'Inter', sans-serif; font-size: 10px; color: #999; width: 100%; text-align: center; padding-bottom: 10px;">
            MomIncome PLR Vault — <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `
      })

      console.log(`Generated: ${pdfPath}`)

      // Upload to Supabase
      const pdfContent = fs.readFileSync(pdfPath)
      const storagePath = `month1-pdf/${path.basename(pdfPath)}`
      
      console.log(`Uploading ${path.basename(pdfPath)} to ${storagePath}...`)
      const { error: uploadError } = await supabase.storage
        .from('plr-assets')
        .upload(storagePath, pdfContent, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (uploadError) {
        console.error(`Error uploading ${asset.file}:`, uploadError.message)
      } else {
        console.log(`Successfully uploaded ${asset.file} to ${storagePath}`)
        
        // Try to update database if column exists, but don't fail if it doesn't
        // as the frontend has a fallback.
        const { error: dbError } = await supabase
          .from('content_assets')
          .update({ file_url_pdf: storagePath })
          .eq('slug', asset.slug)

        if (dbError) {
          console.warn(`Note: DB update for ${asset.slug} skipped (fallback will be used):`, dbError.message)
        }
      }
      await page.close()
    }

    await browser.close()
    console.log('Finished professional PDF generation.')
  } catch (error) {
    console.error('An error occurred during PDF generation:', error)
  }
}

generatePDFs()
