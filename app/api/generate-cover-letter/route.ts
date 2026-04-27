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
        message: 'Your 3-day free trial has expired or you do not have an active subscription.' 
      }, { status: 403 })
    }

    const { jobPosting, resumeData } = await req.json()

    if (!jobPosting) {
      return NextResponse.json({ error: 'Job posting is required' }, { status: 400 })
    }

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System architecture error: GROQ API crucial key is missing' }, { status: 500 })
    }

    // Construct the prompt context from resume data
    const resumeContext = `
      Name: ${resumeData.personalInfo?.firstName} ${resumeData.personalInfo?.lastName}
      Email: ${resumeData.personalInfo?.email}
      Phone: ${resumeData.personalInfo?.phone}
      
      Experience: ${JSON.stringify(resumeData.experience)}
      Education: ${JSON.stringify(resumeData.education)}
      Skills: ${JSON.stringify(resumeData.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and professional copywriter. 
Your task is to write a highly tailored, engaging, and professional cover letter.
You will be provided with:
1. A candidate's resume/profile data.
2. A job posting description.

Guidelines:
- Keep it concise, no more than 3-4 short paragraphs.
- Do not repeat the resume exactly; instead, highlight the most relevant experiences that match the job.
- Start with a strong hook, state why they are a fit, give a concrete example of past success, and close professionally.
- Use the first and last name provided.
- Only output the cover letter text, no metadata, no introduction.`
        },
        {
          role: "user",
          content: `CANDIDATE DATA:\n${resumeContext}\n\nJOB POSTING:\n${jobPosting}`
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
      const errorText = await response.text();
      console.error("Groq Error Payload:", errorText);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const coverLetterText = data.choices[0].message.content.trim();

    return NextResponse.json({ coverLetter: coverLetterText })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate cover letter' }, { status: 500 })
  }
}
