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
        message: 'Your 3-day free trial has expired. Please upgrade to a premium plan to continue using LinkedIn optimization features.' 
      }, { status: 403 })
    }

    const { resumeData } = await req.json()

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System architecture error: GROQ API crucial key is missing' }, { status: 500 })
    }

    const resumeContext = `
      Name: ${resumeData.personalInfo?.firstName} ${resumeData.personalInfo?.lastName}
      Experience: ${JSON.stringify(resumeData.experience)}
      Education: ${JSON.stringify(resumeData.education)}
      Skills: ${JSON.stringify(resumeData.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert LinkedIn profile optimizer and recruiter.
Given the candidate's resume data, provide highly optimized LinkedIn profile sections.
Return ONLY valid JSON in the exact structure below. Do not include markdown formatting or extra text.

Required JSON Structure:
{
  "headline": "A catchy, keyword-rich LinkedIn headline (e.g. Senior Software Engineer | React | AWS | Helping build scalable systems)",
  "summary": "An engaging 'About' section written in first person (2-3 paragraphs) highlighting their career, key achievements, and what drives them.",
  "experience": [
    {
      "company": "Company Name",
      "bullets": [
        "Action-driven bullet point 1 for LinkedIn",
        "Action-driven bullet point 2 for LinkedIn"
      ]
    }
  ],
  "skillsToPin": ["Top 3-5 skills they should pin on LinkedIn"]
}`
        },
        {
          role: "user",
          content: `RESUME DATA:\n${resumeContext}`
        }
      ],
      temperature: 0.3,
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
        const errorText = await response.text();
        console.error("Groq Error Payload:", errorText);
        throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const cleanJSON = data.choices[0].message.content.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJSON);

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to optimize LinkedIn profile' }, { status: 500 })
  }
}
