import { NextRequest, NextResponse } from 'next/server'
import PDFParser from 'pdf2json'
import { extractResumeData } from '@/lib/ai'
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

    const access = await checkSubscriptionAccess(session.user.id, session.user.email)
    if (!access.hasAccess) {
      return NextResponse.json({ 
        error: 'TRIAL_EXPIRED', 
        message: 'Your 3-day free trial has expired or you do not have an active subscription.' 
      }, { status: 403 })
    }

    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const pdfParser = new (PDFParser as any)(null, 1);
    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData: any) => reject(new Error(errData.parserError)));
      pdfParser.on('pdfParser_dataReady', () => {
        resolve(pdfParser.getRawTextContent().replace(/\r\n/g, ' '));
      });
      pdfParser.parseBuffer(buffer);
    });

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    const extractedJson = await extractResumeData(text)

    return NextResponse.json({ data: extractedJson })
  } catch (error: any) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
