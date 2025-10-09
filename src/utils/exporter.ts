import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export function exportToTxt(content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'optimized-resume.txt');
}

export async function exportToDocx(content: string): Promise<void> {
  const sections = content.split(/\n\n+/);
  const paragraphs: Paragraph[] = [];

  sections.forEach(section => {
    const lines = section.split('\n');
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      const isHeading = trimmedLine === trimmedLine.toUpperCase() && 
                       trimmedLine.length < 50 && 
                       !trimmedLine.startsWith('•') && 
                       !trimmedLine.startsWith('-');

      if (isHeading) {
        paragraphs.push(
          new Paragraph({
            text: trimmedLine,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: index === 0 ? 0 : 240,
              after: 120
            },
            alignment: AlignmentType.LEFT
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                font: 'Calibri',
                size: 22
              })
            ],
            spacing: {
              after: 120
            }
          })
        );
      }
    });

    paragraphs.push(
      new Paragraph({
        text: '',
        spacing: { after: 120 }
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: paragraphs
      }
    ]
  });

  const blob = await doc.toBlob();
  saveAs(blob, 'optimized-resume.docx');
}
