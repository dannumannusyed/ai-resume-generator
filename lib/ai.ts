// Utility functions for AI interactions using Groq

const GROQ_API_KEY = process.env.GROQ_API_KEY

async function callGroq(payload: any) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing from .env.local')
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      model: payload.model || 'llama-3.3-70b-versatile',
      temperature: payload.temperature ?? 0.1,
      response_format: payload.response_format ?? { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content.trim())
}

export async function parseJobPosting(jobText: string) {
  return callGroq({
    messages: [
      {
        role: 'system',
        content: `You are an expert recruiter. Extract information from job postings. Return ONLY valid JSON.
{
  "role": "Exact job title",
  "required_skills": ["Skill 1", "Skill 2"],
  "keywords": ["Keyword 1", "Keyword 2"],
  "experience_required": 5,
  "ats_keywords": ["ATS Key 1", "ATS Key 2"],
  "nice_to_have": ["Bonus 1"],
  "salary_range": "Range or null"
}`,
      },
      {
        role: 'user',
        content: `Job description:\n${jobText}`,
      },
    ],
  })
}

export async function generateTailoredResume(resumeData: any, jobRequirements: any) {
  return callGroq({
    messages: [
      {
        role: 'system',
        content: `You are an expert ATS-focused resume writer. Rewrite the resume to match the job requirements.
Keep it professional, quantifiable, and 100% truthful. Return ONLY a valid JSON object.
{
  "full_name": "...",
  "email": "...",
  "phone": "...",
  "summary": "Tailored summary...",
  "experience": [
    {
      "company": "...",
      "role": "...",
      "duration": "...",
      "bullet_points": ["Tailored bullet 1", "Tailored bullet 2"]
    }
  ],
  "education": [...],
  "skills": ["Skill 1", "Skill 2"],
  "ats_score_preview": 85,
  "key_improvements_made": ["Explanation 1", "Explanation 2"]
}`,
      },
      {
        role: 'user',
        content: `Original Resume:\n${JSON.stringify(resumeData)}\n\nJob Requirements:\n${JSON.stringify(jobRequirements)}`,
      },
    ],
  })
}

export async function calculateATSScore(resumeText: string, jobKeywords: string[]): Promise<number> {
  const text = resumeText.toLowerCase()
  const matched = jobKeywords.filter((kw) => text.includes(kw.toLowerCase()))
  return Math.round((matched.length / Math.max(jobKeywords.length, 1)) * 100)
}

export async function getATSSuggestions(resumeText: string, jobKeywords: string[]) {
   return callGroq({
    messages: [
      {
        role: 'system',
        content: `Compare the resume text with the required keywords and provide ATS optimization tips. Return ONLY JSON.
{
  "missing_keywords": ["KW1", "KW2"],
  "formatting_tips": ["Tip 1"],
  "score_breakdown": { "keywords": 80, "formatting": 90 }
}`,
      },
      {
        role: 'user',
        content: `Resume:\n${resumeText}\n\nKeywords:\n${jobKeywords.join(', ')}`,
      },
    ],
  })
}

export async function extractResumeData(pdfText: string) {
  return callGroq({
    messages: [
      {
        role: 'system',
        content: `You are an expert data extractor. Given the raw text of a resume, extract the information and return ONLY a valid JSON object strictly matching this schema. Ensure all fields are present, using empty strings or arrays if data is missing.
{
  "personalInfo": {
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "phone": "...",
    "location": "..."
  },
  "education": [
    {
      "school": "...",
      "degree": "...",
      "field": "...",
      "year": "..."
    }
  ],
  "experience": [
    {
      "company": "...",
      "position": "...",
      "duration": "...",
      "achievements": "..."
    }
  ],
  "skills": ["...", "..."],
  "projects": [
    {
      "name": "...",
      "description": "...",
      "link": "..."
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Raw resume text:\n\n${pdfText}`,
      },
    ],
  })
}
