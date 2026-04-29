import { NextRequest, NextResponse } from 'next/server'
export const maxDuration = 60 // 60 seconds timeout
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

// Simple helper to remove HTML tags and scripts
const extractTextFromHTML = (html: string) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (e) {
      console.warn('NextAuth session check failed (likely missing NEXTAUTH_SECRET):', e)
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSubscriptionAccess(session.user.id, session.user.email)
    if (!access.hasAccess) {
      return NextResponse.json({ 
        error: 'TRIAL_EXPIRED', 
        message: 'Your 3-day free trial has expired. Please upgrade to a premium plan to continue using AI analysis features.' 
      }, { status: 403 })
    }

    let { jobPosting } = await req.json()

    if (!jobPosting) {
      return NextResponse.json({ error: 'Job posting text or URL is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System error: GROQ API key is missing' }, { status: 500 })
    }

    // Check if the user pasted a URL instead of text
    const urlPattern = /^(https?:\/\/[^\s]+)$/i;
    if (urlPattern.test(jobPosting.trim())) {
      try {
        console.log("Analyzing URL with Jina:", jobPosting);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const fetched = await fetch(`https://r.jina.ai/${jobPosting.trim()}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'text/plain'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (fetched.ok) {
          const markdown = await fetched.text();
          if (markdown.length > 100) {
            jobPosting = markdown.substring(0, 8000);
          }
        }
      } catch (err) {
        console.warn("Failed to scrape URL with Jina, continuing with raw input.", err);
      }
    }

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) analyst. Extract job details from whatever text is provided and return ONLY valid JSON.
If the text is just a URL (e.g. because scraping failed), extract as much information as you can from the URL slug (e.g. role, company, location, experience) and make educated guesses for common skills related to that role. DO NOT return an error. ALWAYS return a valid JSON matching the required structure.

Required JSON structure:
{
  "role": "Extracted Job Title from posting or URL",
  "requiredSkills": ["hard skills like 'Python', 'React', 'SQL'"],
  "niceToHave": ["soft or bonus skills"],
  "keywords": ["general keywords like 'agile', 'remote', 'startup'"],
  "experience": "e.g. 3-5 years",
  "atsKeywords": ["Top 5-7 exact ATS keywords"]
}`
        },
        {
          role: "user",
          content: `Job Description content:\n${jobPosting.substring(0, 8000)}` // Limit output size
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    const parsedData = JSON.parse(responseText.trim())
    
    if (parsedData.error) {
      return NextResponse.json({ error: parsedData.error }, { status: 400 })
    }

    return NextResponse.json({ data: parsedData })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze job posting' }, { status: 500 })
  }
}
