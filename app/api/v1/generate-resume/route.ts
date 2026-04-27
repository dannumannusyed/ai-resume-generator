import { NextRequest, NextResponse } from 'next/server'

// Simple helper to check API Key (In production, this would query the db)
const isValidApiKey = (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  return token.startsWith('sk_rm_'); // Validating our mock token prefix
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!isValidApiKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing API key format.' }, { status: 401 })
    }

    const { jobPosting, resumeData } = await req.json()

    if (!jobPosting || !resumeData) {
      return NextResponse.json({ error: 'Both jobPosting and resumeData are required in the request body.' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Internal Server Error: Missing AI credentials' }, { status: 500 })
    }

    const resumeContext = `
      Name: ${resumeData?.personalInfo?.firstName} ${resumeData?.personalInfo?.lastName}
      Experience: ${JSON.stringify(resumeData?.experience)}
      Skills: ${JSON.stringify(resumeData?.skills)}
    `

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS optimization API. 
Your task is to tailor the candidate's resume specifically for the provided job posting.
You must return only validating JSON measuring their fitness.
Format:
{
  "atsScore": 85,
  "tailoredSummary": "A strong software engineer...",
  "keywordMatches": ["React", "APIs"],
  "missingKeywords": ["AWS", "Docker"],
  "suggestions": ["Add AWS certification"]
}`
        },
        {
          role: "user",
          content: `JOB POSTING:\n${jobPosting}\n\nCANDIDATE DATA:\n${resumeContext}`
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
      throw new Error(`Integration API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: JSON.parse(data.choices[0].message.content) })
  } catch (error: any) {
    console.error('v1 API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 })
  }
}
