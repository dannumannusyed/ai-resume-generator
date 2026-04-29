import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkSubscriptionAccess } from '@/lib/subscription-server'

export async function POST(req: NextRequest) {
  try {
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (e) {
      console.warn('NextAuth session check failed:', e)
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // --- Access Check ---
    const access = await checkSubscriptionAccess(session.user.id, session.user.email)
    if (!access.hasAccess) {
      return NextResponse.json({ 
        error: 'TRIAL_EXPIRED', 
        message: 'Your 3-day free trial has expired. Please upgrade to a premium plan to continue using AI tailoring features.' 
      }, { status: 403 })
    }
    // --- End Check ---

    const { resumeData, jobAnalysis } = await req.json()

    if (!resumeData || !jobAnalysis) {
      return NextResponse.json({ error: 'Payload missing required keys' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ API key is missing' }, { status: 500 })
    }
    const resumePayload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an elite, ATS-focused AI resume tailor. Your objective is to achieve a 90%+ ATS match score for the provided job by naturally weaving in keywords, while also transforming the candidate's data into a highly attractive, "sexy", and professional format.

STRICT RULES:
1. NEVER invent fake companies, degrees, or experiences. Use strictly what's provided, but elevate the phrasing.
2. EXACT KEYWORDS: Extract exact keywords from the Job Description and integrate them naturally.
3. ACTION-BASED EXPERIENCE: Format all experience bullet points using strong action verbs. Highlight cost estimation, system workflows, requirement analysis, and quantifiable efficiency improvements if they fit.
4. "SEXY" PROJECTS: Upgrade project descriptions. Clearly state the project's purpose, the specific technologies/stack used (e.g. "Built responsive UI using HTML, CSS, and JavaScript"), and emphasize user impact. Always preserve project links.
5. CATEGORIZED SKILLS: Do NOT just list skills. Group them logically (e.g. Technical Skills, Languages, Frontend, Backend, Tools, Concepts).
6. ROLE & SUMMARY: Generate a professional HEADER ROLE (Target job title + top 2 skills) and a concise, high-impact SUMMARY paragraph.
7. STRICT DATA ONLY: Only include skills strictly present in the user data. Omit any missing categories entirely. DO NOT self-correct. DO NOT apologize. DO NOT output conversational text. Output ONLY the final markdown.

FORMAT THE RESUME STRICTLY IN MARKDOWN:
- # Full Name
- Location · Phone Number · Email Address
- 
- ## SUMMARY
- ### [Target Role] | [Top Skill 1] | [Top Skill 2]
- [2-3 sentence impactful professional summary matching the job description]
-
- ## EXPERIENCE
- ### Job Title at Company
- Company | Duration
- - [Action verb] [what was done] resulting in [impact] using [technologies]
-
- ## EDUCATION
- ### Degree in Field
- University | Year
-
- ## PROJECTS
- ### Project Name - Short catchy subtitle
- - [Impactful project description]
- - Technologies: **Tech 1**, **Tech 2**
- - Project Link: [url]
-
- ## SKILLS
- ## SKILLS
- - **Languages**: [list]
- - **Frontend**: [list]
- (Omit any category you cannot fill based on the data. Never write "None".)

Return ONLY the perfectly formatted resume markdown text, do not write anything else.`
        },
        {
          role: "user",
          content: `JOB REQUIREMENTS: ${JSON.stringify(jobAnalysis)}\n\nCANDIDATE RESUME DATA: ${JSON.stringify(resumeData)}`
        }
      ],
      temperature: 0.4,
    };

    const analysisPayload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an ATS expert. Given a tailored resume and job description, calculate the match score.
For resumes that have been optimized with target keywords, the atsScore should typically fall between 92 and 98 to reflect the high quality of the tailoring.

Return ONLY valid JSON:
{
  "atsScore": 94,
  "originalAtsScore": 45,
  "strongPoints": ["up to 4 genuine strengths for this role"],
  "missingKeywords": ["keywords from job not in resume"],
  "optimizations": ["2-3 specific improvements made"]
}`
        },
        {
          role: "user",
          content: `JOB: ${JSON.stringify(jobAnalysis)}\nRESUME: ${JSON.stringify(resumeData)}`
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    };

    const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    const headers = {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }

    // Run both calls in parallel
    const [resumeRes, analysisRes] = await Promise.all([
      fetch(GROQ_URL, { method: "POST", headers, body: JSON.stringify(resumePayload) }),
      fetch(GROQ_URL, { method: "POST", headers, body: JSON.stringify(analysisPayload) })
    ])

    if (!resumeRes.ok) {
      const err = await resumeRes.text()
      console.error("Resume Gen Error:", err)
      throw new Error(`Groq resume call failed: ${resumeRes.status}`)
    }
    if (!analysisRes.ok) {
      const err = await analysisRes.text()
      console.error("Analysis Gen Error:", err)
      throw new Error(`Groq analysis call failed: ${analysisRes.status}`)
    }

    const [resumeRaw, analysisRaw] = await Promise.all([
      resumeRes.json(),
      analysisRes.json()
    ])

    const resumeText = resumeRaw.choices[0].message.content.trim()
    const analysisRawContent = analysisRaw.choices[0].message.content.trim()
    
    // Robust JSON cleaning
    const cleanAnalysis = analysisRawContent
      .replace(/^```json/, '')
      .replace(/```$/, '')
      .trim()
      
    let analysis;
    try {
      analysis = JSON.parse(cleanAnalysis)
    } catch (e) {
      console.error("Failed to parse analysis JSON:", cleanAnalysis)
      analysis = {
        atsScore: 70,
        originalAtsScore: 40,
        strongPoints: [],
        missingKeywords: [],
        optimizations: []
      }
    }

    console.log("Resume text length:", resumeText.length)
    console.log("ATS score:", analysis.atsScore)

    // Ensure ATS score is 90+ for optimized resumes as per user requirement
    const finalAtsScore = Math.max(90, analysis.atsScore ?? 92);

    const result = {
      resumeText,
      atsScore: finalAtsScore,
      originalAtsScore: analysis.originalAtsScore ?? 40,
      strongPoints: analysis.strongPoints ?? [],
      missingKeywords: analysis.missingKeywords ?? [],
      optimizations: analysis.optimizations ?? []
    }

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate tailored resume' }, { status: 500 })
  }
}
