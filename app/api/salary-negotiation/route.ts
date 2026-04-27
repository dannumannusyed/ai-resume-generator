import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, location, resumeData } = await req.json()

    if (!jobTitle || !location) {
      return NextResponse.json({ error: 'Job title and location are required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System error: GROQ API key is missing' }, { status: 500 })
    }

    const resumeContext = resumeData ? `
      Experience: ${JSON.stringify(resumeData.experience)}
      Skills: ${JSON.stringify(resumeData.skills)}
    ` : 'No resume data provided.'

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert compensation analyst and career coach.
Your task is to provide a salary negotiation strategy. 
You will be provided with:
1. A job title and location.
2. The user's experience and skills.

Respond with:
- Estimated Market Range for this role/location.
- The User's Leverage (based on their skills/experience).
- A step-by-step negotiation script or talking points to help them ask for higher pay.
Format using Markdown.`
        },
        {
          role: "user",
          content: `JOB TITLE: ${jobTitle}\nLOCATION: ${location}\n\nCANDIDATE DATA:\n${resumeContext}`
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
    return NextResponse.json({ strategy: data.choices[0].message.content.trim() })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate salary strategy' }, { status: 500 })
  }
}
