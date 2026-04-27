# DEPLOYMENT GUIDE

## Deploy to Vercel (Recommended)

### Step 1: Connect GitHub Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js

### Step 2: Configure Environment Variables

Add these to Vercel Project Settings → Environment Variables:

```
ANTHROPIC_API_KEY=your_key
NEXTAUTH_SECRET=your_secret (generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://yourdomain.com
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
GOOGLE_ID=your_google_id
GOOGLE_SECRET=your_google_secret
DATABASE_URL=your_supabase_url
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_UNLIMITED_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 3: Deploy Database

**Option A: Use Supabase (Recommended)**

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your DATABASE_URL from Project Settings
4. Run migrations (create schema)

**Option B: Use Railway or Render**

1. Create PostgreSQL database
2. Get connection string
3. Add to environment variables

### Step 4: Setup Authentication

**GitHub OAuth:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create New OAuth App
3. Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and Secret

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 Credentials
3. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`

### Step 5: Setup Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Create products for Pro and Unlimited plans
3. Get Price IDs
4. Setup webhook: `https://yourdomain.com/api/webhooks/stripe`

### Step 6: Deploy

```bash
# Vercel auto-deploys when you push to main
git push origin main
```

---

## Local Development

### Setup

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your API keys to `.env.local`

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Testing

- Test resume builder at `/builder/resume`
- Test job analyzer at `/builder/job`
- Test auth at `/auth/login` and `/auth/signup`

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  trial_resumes_used INT DEFAULT 0,
  trial_started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  content TEXT,
  job_title VARCHAR(255),
  ats_score INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Job Analysis Cache
```sql
CREATE TABLE job_analyses (
  id UUID PRIMARY KEY,
  job_url_hash VARCHAR(255) UNIQUE,
  analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Monitoring & Analytics

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const withSentry = require("@sentry/nextjs/withSentry");

module.exports = withSentry({
  // ... your config
});
```

### Posthog (Analytics)

```bash
npm install posthog-js
```

Track events:
```javascript
import { usePostHog } from 'posthog-js/react'

const posthog = usePostHog()
posthog.capture('resume_generated', { ats_score: 87 })
```

---

## Scaling Considerations

### Database Optimization
- Index: `job_analyses.job_url_hash`
- Index: `resumes.user_id`
- Implement pagination for resume list

### Caching
- Cache job analyses in Redis (1 day TTL)
- Use Next.js ISR for public pages

### Rate Limiting
- Use Upstash Redis for rate limiting
- Limit AI API calls per user

### CDN
- Vercel auto-enables Edge Caching
- Use Cloudflare for additional caching

---

## Troubleshooting

### Deployment fails
- Check logs: `vercel logs`
- Verify all env vars are set
- Ensure database connection works

### AI API errors
- Check Anthropic API quota
- Verify API key is correct
- Check rate limits

### Authentication issues
- Clear cookies and cache
- Verify callback URLs in OAuth apps
- Check `NEXTAUTH_SECRET` is set

---

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe webhook configured
- [ ] Error tracking (Sentry) setup
- [ ] Analytics (Posthog) configured
- [ ] Domain SSL certificate
- [ ] Email notifications setup
- [ ] Support contact configured
- [ ] Terms of Service & Privacy Policy added
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Monitoring alerts setup

---

## Contact & Support

For deployment issues, email: support@resumemaster.app
