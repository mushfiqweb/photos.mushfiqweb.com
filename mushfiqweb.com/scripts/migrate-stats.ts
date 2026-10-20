import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// 1. Manually load environment variables from .env
try {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const firstEquals = trimmed.indexOf('=')
      if (firstEquals > 0) {
        const key = trimmed.slice(0, firstEquals).trim()
        const value = trimmed.slice(firstEquals + 1).trim()
        process.env[key] = value
      }
    }
    console.log('✅ Loaded environment variables from .env')
  } else {
    console.error('❌ .env file not found at:', envPath)
    process.exit(1)
  }
} catch (e) {
  console.error('❌ Failed to load .env file:', e)
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase environment variables are missing in .env!')
  process.exit(1)
}

// Initialize Supabase Client with Service Role Key for writing
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface StatsEntry {
  type: string
  slug: string
  views: number
  loves: number
  applauses: number
  ideas: number
  bullseyes: number
}

async function run() {
  const jsonPath = path.join(process.cwd(), 'data', 'stats.json')
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ stats.json not found at:', jsonPath)
    process.exit(1)
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8')
  const entries: StatsEntry[] = JSON.parse(rawData)
  console.log(`📊 Found ${entries.length} entries in stats.json to migrate.`)

  let insertedCount = 0
  let updatedCount = 0
  let errorCount = 0

  for (const entry of entries) {
    const { type, slug, views, loves, applauses, ideas, bullseyes } = entry
    try {
      // Query existing row in Supabase
      const { data: dbRow, error: queryError } = await supabase
        .from('stats')
        .select('*')
        .eq('type', type)
        .eq('slug', slug)
        .maybeSingle()

      if (queryError) {
        throw queryError
      }

      if (dbRow) {
        // Row exists: sum current values and exported values
        const mergedViews = (dbRow.views || 0) + (views || 0)
        const mergedLoves = (dbRow.loves || 0) + (loves || 0)
        const mergedApplauses = (dbRow.applauses || 0) + (applauses || 0)
        const mergedIdeas = (dbRow.ideas || 0) + (ideas || 0)
        const mergedBullseyes = (dbRow.bullseyes || 0) + (bullseyes || 0)

        const { error: updateError } = await supabase
          .from('stats')
          .update({
            views: mergedViews,
            loves: mergedLoves,
            applauses: mergedApplauses,
            ideas: mergedIdeas,
            bullseyes: mergedBullseyes,
          })
          .eq('type', type)
          .eq('slug', slug)

        if (updateError) {
          throw updateError
        }
        updatedCount++
      } else {
        // Row does not exist: insert fresh record
        const { error: insertError } = await supabase.from('stats').insert({
          type,
          slug,
          views: views || 0,
          loves: loves || 0,
          applauses: applauses || 0,
          ideas: ideas || 0,
          bullseyes: bullseyes || 0,
        })

        if (insertError) {
          throw insertError
        }
        insertedCount++
      }
    } catch (err) {
      console.error(`❌ Error migrating ${type}/${slug}:`, err)
      errorCount++
    }
  }

  console.log('\n====================================')
  console.log('🎉 MIGRATION COMPLETED')
  console.log(`✅ Inserted: ${insertedCount}`)
  console.log(`🔄 Updated/Merged: ${updatedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log('====================================')

  if (errorCount > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

run()
