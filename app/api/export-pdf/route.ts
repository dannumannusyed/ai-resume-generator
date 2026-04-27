import { NextRequest, NextResponse } from 'next/server'
import { generatePDF } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  try {
    const { resumeContent } = await request.json()

    if (!resumeContent) {
      return NextResponse.json({ error: 'Resume content is required' }, { status: 400 })
    }

    // Generate real PDF content
    const pdf = await generatePDF(resumeContent)
    
    // Output the PDF as a buffer for the response
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    })
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 })
  }
}
