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
        message: 'Your 3-day free trial has expired. Please upgrade to a premium plan to continue using AI job matching features.' 
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
      Location: ${resumeData.personalInfo?.location}
      Experience: ${JSON.stringify(resumeData.experience)}
      Education: ${JSON.stringify(resumeData.education)}
      Skills: ${JSON.stringify(resumeData.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an AI Job Matching Engine.
Given a candidate's resume, generate 4-5 highly relevant job opportunities that are a strong match for their skills and experience level.
Return ONLY valid JSON in the exact structure below. Do not include markdown formatting.

Required JSON Structure:
{
  "jobs": [
    {
      "title": "Job Title (e.g., Senior React Engineer)",
      "company": "Fictional Tech Company Name",
      "location": "Remote or Specific City",
      "salary": "Salary range",
      "matchScore": 95, // 0-100 integer
      "matchReasons": ["A specific reason why they match, referencing a skill", "Another specific reason"],
      "description": "A short, 2-sentece job description"
    }
  ]
}`
        },
        {
          role: "user",
          content: `CANDIDATE DATA:\n${resumeContext}`
        }
      ],
      temperature: 0.6,
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

    // Sort by match score descending
    if (parsedData.jobs && Array.isArray(parsedData.jobs)) {
      parsedData.jobs.sort((a: any, b: any) => b.matchScore - a.matchScore);
    }

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch job matches' }, { status: 500 })
  }
}
