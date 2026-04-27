import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { targetRole, resumeData } = await req.json()

    if (!targetRole || !resumeData) {
      return NextResponse.json({ error: 'Target role and resume data are required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'System error: GROQ API key is missing' }, { status: 500 })
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
          content: `You are an IT Training & Development Coach.
Analyze the user's current experience vs the Target Role they want.
Output:
- Missing critical skills (the Gap).
- 2-3 specific recommendations on how to acquire them (e.g., specific certifications or types of projects to build).
Format as Markdown.`
        },
        {
          role: "user",
          content: `TARGET ROLE: ${targetRole}\n\nCANDIDATE DATA:\n${resumeContext}`
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
    return NextResponse.json({ gapAnalysis: data.choices[0].message.content.trim() })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze skill gap' }, { status: 500 })
  }
}
