// PDF generation utilities
import jsPDF from 'jspdf'

export async function generatePDF(resumeContent: string) {
  const pdf = new jsPDF()

  // Set font
  pdf.setFontSize(12)
  pdf.setFont('Helvetica')

  // Split content into lines for better formatting
  const lines = pdf.splitTextToSize(resumeContent, 190)
  let yPosition = 10

  lines.forEach((line: string) => {
    if (yPosition > 280) {
      pdf.addPage()
      yPosition = 10
    }
    pdf.text(line, 10, yPosition)
    yPosition += 7
  })

  return pdf
}

export function downloadPDF(pdf: any, fileName: string = 'resume.pdf') {
  pdf.save(fileName)
}

// Template designs
export const RESUME_TEMPLATES = {
  modern: {
    name: 'Modern',
    colors: {
      primary: '#0ea5e9',
      secondary: '#1e293b',
      accent: '#f3f4f6',
    },
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#ffffff',
    },
  },
  professional: {
    name: 'Professional',
    colors: {
      primary: '#1e40af',
      secondary: '#1f2937',
      accent: '#f9fafb',
    },
  },
}
