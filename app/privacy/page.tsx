import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-10 md:p-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
            <p className="font-medium text-slate-900 italic">Last updated: April 30, 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, build a resume, or communicate with us. This includes your name, email address, professional experience, and any other data you input into our resume builder.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, including the AI-powered tailoring of your resumes. We also use it to communicate with you about your account and our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">3. Data Security</h2>
              <p>We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. Your data is stored on secure servers and encrypted at rest.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">4. AI Analysis</h2>
              <p>Our AI processes your resume data solely for the purpose of providing optimization suggestions and tailoring services. We do not use your personal professional data to train general models in a way that could expose your private information.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">5. Third-Party Services</h2>
              <p>We use third-party services like Razorpay for payment processing and NextAuth for authentication. These services have their own privacy policies and we recommend you review them.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">6. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@resumemaster.app.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
