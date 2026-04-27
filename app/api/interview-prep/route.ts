import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeData, jobPosting } = await req.json()

    if (!resumeData || !jobPosting) {
      return NextResponse.json({ error: 'Resume data and job posting are required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System architecture error: GROQ API crucial key is missing' }, { status: 500 })
    }

    const resumeContext = `
      Experience: ${JSON.stringify(resumeData.experience)}
      Skills: ${JSON.stringify(resumeData.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer and hiring manager.
Given a candidate's resume data and the target job description, generate 5 highly tailored interview questions.
Include a mix of behavioral and technical questions, specifically referencing the candidate's past experience where applicable to the job requirements.

Return valid JSON exactly in this format:
{
  "questions": [
    {
      "question": "The interview question",
      "category": "behavioral | technical | culture",
      "hint": "A 1-2 sentence tip on how the candidate should structure their answer, what STAR method points to hit, or what you are looking for."
    }
  ]
}`
        },
        {
          role: "user",
          content: `JOB DESCRIPTION:\n${jobPosting}\n\nCANDIDATE RESUME:\n${resumeContext}`
        }
      ],
      temperature: 0.4,
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
    return NextResponse.json({ error: error.message || 'Failed to generate interview prep' }, { status: 500 })
  }
}
