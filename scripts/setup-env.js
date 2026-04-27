#!/usr/bin/env node

import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const envFile = join(process.cwd(), '.env.local')
const exampleFile = join(process.cwd(), '.env.example')

console.log('🔐 Generating NEXTAUTH_SECRET...')

try {
  // Generate random secret
  const secret = require('crypto').randomBytes(32).toString('hex')

  // Read example file
  let envContent = readFileSync(exampleFile, 'utf8')

  // Replace placeholder with actual secret
  envContent = envContent.replace(
    'NEXTAUTH_SECRET=$(openssl rand -base64 32)',
    `NEXTAUTH_SECRET=${secret}`
  )

  // Write to .env.local
  writeFileSync(envFile, envContent)

  console.log('✅ .env.local created successfully!')
  console.log(`📝 Location: ${envFile}`)
  console.log('⚠️  Remember to add your API keys before running the app!')
} catch (error) {
  console.error('❌ Error creating .env.local:', error)
  process.exit(1)
}
