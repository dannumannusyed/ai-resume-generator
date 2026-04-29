import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds timeout
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

// Simple helper to strip HTML tags from scraped pages
const extractTextFromHTML = (html: string) =>
  html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export async function POST(request: NextRequest) {
  try {
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (e) {
      console.warn('NextAuth session check failed (likely missing NEXTAUTH_SECRET):', e)
    }
    
    // Check access only if logged in, otherwise allow public trial
    if (session?.user?.id) {
      const access = await checkSubscriptionAccess(session.user.id, session.user.email)
      if (!access.hasAccess) {
        return NextResponse.json({ 
          error: 'TRIAL_EXPIRED', 
          message: 'Your 3-day free trial has expired. Please upgrade to a premium plan to continue using AI analysis features.' 
        }, { status: 403 })
      }
    }

    let { jobPosting } = await request.json()

    if (!jobPosting) {
      return NextResponse.json({ error: 'Job posting is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key is missing' }, { status: 500 })
    }

    // Detect URL and scrape the actual job page content
    const urlPattern = /^(https?:\/\/[^\s]+)$/i
    if (urlPattern.test(jobPosting.trim())) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout for Jina

        // Use Jina AI Reader to bypass bot protection and get clean markdown
        const fetched = await fetch(`https://r.jina.ai/${jobPosting.trim()}`, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'text/plain' 
          },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (fetched.ok) {
          const markdown = await fetched.text()
          if (markdown.length > 200) {
            jobPosting = markdown
          }
        }
      } catch (err) {
        console.warn('Jina URL scrape failed, using raw input:', err)
      }
    }

    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a strict ATS Expert. Extract real information from the provided job description and return ONLY valid JSON.
If the text is just a URL (e.g. because scraping failed), extract as much information as you can from the URL slug (e.g. role, company, location, experience) and make educated guesses for common skills related to that role. DO NOT return an error. ALWAYS return a valid JSON matching the required structure.

Required structure:
{
  "role": "Exact job title from posting or URL",
  "requiredSkills": ["real", "hard", "skills", "listed"],
  "niceToHave": ["bonus", "optional", "skills"],
  "keywords": ["general", "keywords"],
  "experience": "Years of experience required",
  "atsKeywords": ["top 5-7 ATS keywords"]
}`
        },
        {
          role: 'user',
          content: `Job Description:\n${jobPosting.substring(0, 8000)}`
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error(`Groq API returned ${response.status}`)

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content.trim())

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Error analyzing job:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze job posting' }, { status: 500 })
  }
}
