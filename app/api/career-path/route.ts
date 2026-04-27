import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const access = await checkSubscriptionAccess(session.user.id, session.user.email)
    if (!access.hasAccess) {
      return NextResponse.json({ 
        error: 'TRIAL_EXPIRED', 
        message: 'Your trial has expired. Upgrade to unlock career path suggestions.' 
      }, { status: 403 })
    }

    const { resumeData } = await req.json()

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System error: GROQ API key is missing' }, { status: 500 })
    }

    const resumeContext = `
      Experience: ${JSON.stringify(resumeData.experience)}
      Education: ${JSON.stringify(resumeData.education)}
      Skills: ${JSON.stringify(resumeData.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert career counselor. Analyze the provided resume and suggest 3 potential career paths.
For each path, provide:
- The Job Title
- Why it's a good fit based on current skills.
- The next 1-2 skills they should learn to achieve it.
Format as Markdown.`
        },
        {
          role: "user",
          content: `CANDIDATE DATA:\n${resumeContext}`
        }
      ],
      temperature: 0.5,
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
    return NextResponse.json({ paths: data.choices[0].message.content.trim() })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate career paths' }, { status: 500 })
  }
}
