# AI Resume Generator

🚀 **AI-Powered Resume Generator** - Create tailored, ATS-optimized resumes in minutes.

## Features

✨ **AI Resume Tailoring**
- Paste any job posting
- Automatically optimizes your resume for that specific job
- Matches keywords for ATS systems

📊 **ATS Optimization**
- Real-time ATS score calculation
- Keyword matching analysis
- Suggestions to improve your resume

⚡ **Fast & Easy**
- Multi-step conversational form
- Live preview with real-time updates
- Download PDF in seconds

💾 **Smart Storage**
- Save multiple resumes
- Resume history and versioning
- Compare different versions

## Tech Stack

**Frontend:**
- Next.js 14 with TypeScript
- React for UI components
- Tailwind CSS for styling
- Zustand for state management
- Framer Motion for animations

**Backend:**
- Node.js + Express
- Claude 3.5 Sonnet for AI
- PostgreSQL (Supabase) for database
- NextAuth.js for authentication

**Deployment:**
- Vercel for frontend + API
- Supabase for database

## 🚀 One-Click Start

For a quick setup and launch, use the provided start scripts:

- **Windows**: Double-click `start.bat`
- **Linux/macOS**: Run `./start.sh`

These scripts will automatically:
1. Check for Node.js
2. Install dependencies (`npm install`)
3. Setup environment variables (`.env.local`)
4. Start the development server
5. Open the app in your browser

---

## Detailed Setup

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables:
```
ANTHROPIC_API_KEY=your_key
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-resume-generator/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages
│   ├── builder/          # Resume builder
│   ├── dashboard/        # User dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── ai.ts             # AI utilities (Claude)
│   ├── pdf.ts            # PDF generation
│   └── store.ts          # Zustand store
├── components/           # Reusable components
├── public/               # Static assets
├── package.json          # Dependencies
└── README.md             # This file
```

## Usage

### Create a Resume

1. Sign up or login
2. Click "Create New Resume"
3. Fill in your information step-by-step:
   - Personal Info
   - Education
   - Experience
   - Skills
   - Projects
4. Paste a job posting
5. Generate tailored resume
6. Review and edit
7. Download as PDF

### Match Your Resume to a Job

1. Go to "Match My Resume"
2. Paste or upload a job posting
3. See keyword matches and ATS score
4. Get AI suggestions to improve
5. Apply changes and download

## API Documentation

### `/api/analyze-job` - Analyze Job Posting

```bash
POST /api/analyze-job
Content-Type: application/json

{
  "jobPosting": "Job description text..."
}

Response:
{
  "role": "Senior Engineer",
  "required_skills": ["Python", "AWS"],
  "keywords": ["microservices", "agile"],
  "ats_keywords": ["scrum", "CI/CD"]
}
```

### `/api/generate-resume` - Generate Tailored Resume

```bash
POST /api/generate-resume
Content-Type: application/json

{
  "resumeData": {...},
  "jobAnalysis": {...}
}

Response:
{
  "content": "Generated resume...",
  "atsScore": 87,
  "keywordMatches": [...],
  "suggestions": [...]
}
```

### `/api/export-pdf` - Export Resume to PDF

```bash
POST /api/export-pdf
Content-Type: application/json

{
  "resumeContent": "Resume text..."
}

Response: PDF file
```

## Pricing

- **Free**: 3 resumes/month, basic features
- **Pro**: $9/month - 30 resumes/month, all features
- **Unlimited**: $19/month - unlimited resumes, premium features

## Roadmap

- [x] Resume builder
- [x] Job analyzer
- [x] ATS scoring
- [ ] Cover letter generator
- [ ] LinkedIn optimizer
- [ ] Interview prep
- [ ] Mobile app
- [ ] Team collaboration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@resumemaster.app or open an issue on GitHub.

---

**Made with ❤️ by the ResumeMaster team**
