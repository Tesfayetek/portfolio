import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
} from 'docx';
import { jsPDF } from 'jspdf';
import { TargetJobParams, ProfileData } from '../types';

export interface ExecutiveLetterData {
  senderName: string;
  senderTitle: string;
  senderLocation: string;
  senderPhone: string;
  senderEmail: string;
  senderWebsite: string;
  date: string;
  recipientAuthority: string;
  recipientOrganization: string;
  recipientLocation: string;
  subject: string;
  greeting: string;
  introParagraph: string;
  competencyHeading: string;
  bullets: Array<{ title: string; description: string }>;
  mandateParagraph?: string;
  alignmentParagraph: string;
  closingParagraph: string;
  signoff: string;
}

export function buildExecutiveLetterData(
  params: TargetJobParams,
  profile: ProfileData,
  customDate?: string
): ExecutiveLetterData {
  const date =
    customDate ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const role = params.role.trim() || 'System Support Application Officer';
  const org = params.organization.trim() || 'Prospective Organization';
  const authority = params.hiringAuthority.trim() || 'Search Committee';
  const loc = params.location.trim() || 'Addis Ababa / Remote';

  const greeting = authority.toLowerCase().includes('dear')
    ? authority
    : authority.toLowerCase().includes('committee') ||
      authority.toLowerCase().includes('board') ||
      authority.toLowerCase().includes('team')
    ? `Dear Members of the ${authority},`
    : `Dear ${authority},`;

  const bullets = [
    {
      title: 'Application Support & Access Governance: ',
      description:
        'Provide day-to-day functional and technical support for core reinsurance business applications, manage user access lifecycle and permissions according to approved protocols, and isolate root causes for recurring incidents (Ethiopian Reinsurance S.C.).',
    },
    {
      title: 'Network & Hardware Systems: ',
      description:
        'Directed IT systems and network operations ensuring optimal performance and reliability, deployed hardware and software solutions, and collaborated cross-functionally for rapid incident resolution (Urban Revenue Reform Project Office).',
    },
    {
      title: 'Database Administration & Data Integrity: ',
      description:
        'Administered mission-critical Oracle (11g DBA Certified) and MySQL database environments, safeguarding data security and integrity, optimizing query performance, and executing zero-loss backup and disaster recovery operations.',
    },
  ];

  return {
    senderName: 'TESFAYE TEKLU FEYISSA',
    senderTitle:
      'System Support Application Officer | IT Systems | Database Administration | Web Development',
    senderLocation: profile.location || 'Addis Ababa, Ethiopia',
    senderPhone: profile.phone || '+251-932083373',
    senderEmail: profile.email || 'contactesfaye@gmail.com',
    senderWebsite: profile.website || 'www.tesfayeteklu.com',
    date,
    recipientAuthority: authority,
    recipientOrganization: org,
    recipientLocation: loc,
    subject: `RE: Application for ${role}`,
    greeting,
    introParagraph: `I am writing to express my focused interest in contributing as your next ${role} at ${org}. With over a decade of dedicated expertise in database administration, IT systems management, application support, networking, and web development, I have consistently delivered robust infrastructure reliability, data security, and operational excellence.`,
    competencyHeading: 'Strategic Competency & Verified Record Alignment:',
    bullets,
    mandateParagraph: params.roleDescription?.trim()
      ? `Regarding your specific role mandates (${params.roleDescription.trim()}), I bring direct operational experience in high-volume enterprise systems, disciplined change governance, and cross-functional leadership to ensure seamless implementation.`
      : undefined,
    alignmentParagraph: `${org}'s requirement for dependable systems and operational continuity aligns directly with my hands-on background. Across high-stakes environments—from national property registry systems to reinsurance platforms—I have enforced strict access permissions, resolved complex technical issues, and collaborated cross-functionally to achieve organizational objectives.`,
    closingParagraph: `I welcome the opportunity to discuss how my verified background in database administration, IT systems management, and application support will add immediate and enduring value to ${org}. Thank you for your time and consideration.`,
    signoff: 'Sincerely,',
  };
}

/**
 * Generate and download a genuine Microsoft Word (.docx) document.
 */
export async function downloadExecutiveLetterDocx(
  input: TargetJobParams | ExecutiveLetterData,
  profile?: ProfileData,
  dateStr?: string
): Promise<void> {
  const data = 'senderName' in input ? input : buildExecutiveLetterData(input, profile!, dateStr);

  const docChildren: Paragraph[] = [
    // Header - Sender Name
    new Paragraph({
      children: [
        new TextRun({
          text: data.senderName,
          bold: true,
          size: 28, // 14pt
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 40 },
    }),

    // Header - Sender Title
    new Paragraph({
      children: [
        new TextRun({
          text: data.senderTitle,
          bold: true,
          size: 19, // 9.5pt
          color: '334155',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 40 },
    }),

    // Header - Contact Details with bottom border
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.senderPhone}   |   ${data.senderEmail}   |   ${data.senderLocation}   |   ${data.senderWebsite}`,
          size: 18, // 9pt
          color: '64748B',
          font: 'Calibri',
        }),
      ],
      border: {
        bottom: {
          color: 'CBD5E1',
          space: 8,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { after: 240 },
    }),

    // Letter Date
    new Paragraph({
      children: [
        new TextRun({
          text: data.date,
          size: 21, // 10.5pt
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 180 },
    }),

    // Recipient Information Block
    ...(data.recipientAuthority
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: data.recipientAuthority,
                bold: true,
                size: 21,
                color: '0F172A',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 30 },
          }),
        ]
      : []),
    ...(data.recipientOrganization
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: data.recipientOrganization,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 30 },
          }),
        ]
      : []),
    ...(data.recipientLocation
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: data.recipientLocation,
                size: 21,
                color: '475569',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 200 },
          }),
        ]
      : [new Paragraph({ text: '', spacing: { after: 160 } })]),

    // Subject Line
    new Paragraph({
      children: [
        new TextRun({
          text: data.subject,
          bold: true,
          size: 22, // 11pt
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 180 },
    }),

    // Salutation
    new Paragraph({
      children: [
        new TextRun({
          text: data.greeting,
          size: 21,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 160 },
    }),

    // Intro Paragraph
    new Paragraph({
      children: [
        new TextRun({
          text: data.introParagraph,
          size: 21,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 180, line: 276 },
    }),

    // Key Competencies Heading
    new Paragraph({
      children: [
        new TextRun({
          text: data.competencyHeading,
          bold: true,
          size: 21,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
      spacing: { before: 80, after: 100 },
    }),

    // Bullet Items
    ...data.bullets.map(
      (b) =>
        new Paragraph({
          children: [
            new TextRun({
              text: b.title,
              bold: true,
              size: 21,
              color: '0F172A',
              font: 'Calibri',
            }),
            new TextRun({
              text: b.description,
              size: 21,
              color: '334155',
              font: 'Calibri',
            }),
          ],
          bullet: { level: 0 },
          spacing: { after: 90, line: 260 },
        })
    ),

    // Mandate paragraph if present
    ...(data.mandateParagraph
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: data.mandateParagraph,
                size: 21,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
            spacing: { before: 80, after: 160, line: 276 },
          }),
        ]
      : []),

    // Alignment Paragraph
    new Paragraph({
      children: [
        new TextRun({
          text: data.alignmentParagraph,
          size: 21,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { before: 80, after: 160, line: 276 },
    }),

    // Closing Paragraph
    new Paragraph({
      children: [
        new TextRun({
          text: data.closingParagraph,
          size: 21,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 200, line: 276 },
    }),

    // Sign-off
    new Paragraph({
      children: [
        new TextRun({
          text: data.signoff,
          size: 21,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 160 },
    }),

    // Signer Name
    new Paragraph({
      children: [
        new TextRun({
          text: 'Tesfaye Teklu Feyissa',
          bold: true,
          size: 23, // 11.5pt
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 30 },
    }),

    // Signer Title
    new Paragraph({
      children: [
        new TextRun({
          text: 'System Support Application Officer | Database Administrator | IT Systems',
          size: 19,
          color: '475569',
          font: 'Calibri',
        }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Tesfaye_Teklu_Feyissa_Executive_Letter.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a genuine PDF (.pdf) document.
 */
export async function downloadExecutiveLetterPdf(
  input: TargetJobParams | ExecutiveLetterData,
  profile?: ProfileData,
  dateStr?: string
): Promise<void> {
  const data = 'senderName' in input ? input : buildExecutiveLetterData(input, profile!, dateStr);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170mm
  let curY = 22;

  // Top decorative accent line (navy)
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(marginX, 14, contentWidth, 1.2, 'F');

  // Sender Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(data.senderName, marginX, curY);
  curY += 5.5;

  // Sender Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85); // #334155
  doc.text(data.senderTitle, marginX, curY);
  curY += 4.5;

  // Contact Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // #64748B
  const contactText = `${data.senderPhone}   •   ${data.senderEmail}   •   ${data.senderLocation}   •   ${data.senderWebsite}`;
  doc.text(contactText, marginX, curY);
  curY += 3.5;

  // Horizontal divider
  doc.setDrawColor(203, 213, 225); // #CBD5E1
  doc.setLineWidth(0.3);
  doc.line(marginX, curY, marginX + contentWidth, curY);
  curY += 7;

  // Letter Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(data.date, marginX, curY);
  curY += 6;

  // Recipient block
  if (data.recipientAuthority) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(data.recipientAuthority, marginX, curY);
    curY += 4.5;
  }
  if (data.recipientOrganization) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(data.recipientOrganization, marginX, curY);
    curY += 4.5;
  }
  if (data.recipientLocation) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(data.recipientLocation, marginX, curY);
    curY += 6;
  } else {
    curY += 2;
  }

  // Subject Line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(data.subject, marginX, curY);
  curY += 6;

  // Salutation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(data.greeting, marginX, curY);
  curY += 5.5;

  // Helper for text blocks with page-break awareness
  const printParagraph = (text: string, spaceAfter = 4.5) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      if (curY > pageHeight - 22) {
        doc.addPage();
        curY = 22;
      }
      doc.text(line, marginX, curY);
      curY += 4.2;
    }
    curY += spaceAfter;
  };

  // Intro Paragraph
  printParagraph(data.introParagraph, 4.5);

  // Key Competencies Heading
  if (curY > pageHeight - 25) {
    doc.addPage();
    curY = 22;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.competencyHeading, marginX, curY);
  curY += 4.8;

  // Bullets with proper inline title and hanging indent
  data.bullets.forEach((b) => {
    if (curY > pageHeight - 25) {
      doc.addPage();
      curY = 22;
    }

    // Bullet symbol
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('•', marginX + 1.5, curY);

    // Title in bold
    const title = b.title.trim() + ' ';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, marginX + 6, curY);

    // Flowing description
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const bulletAvailableWidth = contentWidth - 6;
    const words = b.description.split(' ');
    let line = '';
    let currentLineX = marginX + 6 + titleWidth;
    let currentLimit = bulletAvailableWidth - titleWidth;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      if (doc.getTextWidth(testLine) > currentLimit && line) {
        doc.text(line, currentLineX, curY);
        curY += 4.0;
        line = words[i];
        currentLineX = marginX + 6;
        currentLimit = bulletAvailableWidth;
        if (curY > pageHeight - 22) {
          doc.addPage();
          curY = 22;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      doc.text(line, currentLineX, curY);
      curY += 4.8;
    }
  });

  curY += 1.0;

  // Mandate paragraph if present
  if (data.mandateParagraph) {
    printParagraph(data.mandateParagraph, 4.5);
  }

  // Alignment Paragraph
  printParagraph(data.alignmentParagraph, 4.5);

  // Closing Paragraph
  printParagraph(data.closingParagraph, 5.5);

  // Signoff
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(data.signoff, marginX, curY);
  curY += 5.5;

  // Signer Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Tesfaye Teklu Feyissa', marginX, curY);
  curY += 4.5;

  // Signer Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'System Support Application Officer | Database Administrator | IT Systems',
    marginX,
    curY
  );

  // Bottom footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(marginX, pageHeight - 14, marginX + contentWidth, pageHeight - 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94A3B8
  doc.text(
    'Executive Application Dossier • Tesfaye Teklu Feyissa',
    marginX,
    pageHeight - 9.5
  );
  doc.text(
    `Synthesized: ${data.date}`,
    pageWidth - marginX - doc.getTextWidth(`Synthesized: ${data.date}`),
    pageHeight - 9.5
  );

  doc.save('Tesfaye_Teklu_Feyissa_Executive_Letter.pdf');
}
