import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const pdfName = searchParams.get('name') || 'Hebrewbooks_org_37952.pdf';
    
    // Path to the PDF file
    const pdfPath = path.join(process.cwd(), 'src/pdfs', pdfName);
    
    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json({ error: `PDF file ${pdfName} not found` }, { status: 404 });
    }
    
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Return the PDF file directly
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${pdfName}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400'
      }
    });
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: 'Failed to serve PDF' }, { status: 500 });
  }
}