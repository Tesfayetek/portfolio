/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { jsPDF } from 'jspdf';
import { PortfolioContentState } from '../types';

export async function downloadResumeDocx(content: PortfolioContentState): Promise<void> {
  const { profile, experience, education, skillDomains, certifications, awards, languages } = content;

  // Filter only published items
  const pubExp = experience.filter((e) => e.published !== false);
  const pubEdu = education.filter((e) => e.published !== false);
  const pubSkills = skillDomains.filter((s) => s.published !== false);
  const pubCerts = certifications.filter((c) => c.published !== false);
  const pubAwards = awards.filter((a) => a.published !== false);
  const pubLangs = languages.filter((l) => l.published !== false);

  const docChildren: Paragraph[] = [
    // Header Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: profile.fullName.toUpperCase(),
          bold: true,
          size: 36, // 18pt
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    }),

    // Title / Subtitle
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: profile.credentialTitle || profile.tagline,
          bold: true,
          size: 22,
          color: '0369A1',
          font: 'Calibri',
        }),
      ],
    }),

    // Contact Information Line
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 260 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 8,
          color: 'CBD5E1',
          space: 4,
        },
      },
      children: [
        new TextRun({
          text: `${profile.location}  |  ${profile.phone}  |  ${profile.email}  |  ${profile.linkedIn}`,
          size: 18,
          color: '475569',
          font: 'Calibri',
        }),
      ],
    }),

    // Section 1: Professional Summary Heading
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '0369A1',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'PROFESSIONAL SUMMARY',
          bold: true,
          size: 24,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    }),

    // Summary Text
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: profile.bio1,
          size: 20,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: profile.bio2,
          size: 20,
          color: '1E293B',
          font: 'Calibri',
        }),
      ],
    }),

    // Section 2: Technical Competencies Heading
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '0369A1',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'CORE TECHNICAL COMPETENCIES',
          bold: true,
          size: 24,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    }),
  ];

  // Add Skill Domains
  pubSkills.forEach((domain) => {
    const skillList = domain.skills.map((s) => `${s.name} (${s.level})`).join(', ');
    docChildren.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `• ${domain.title}: `,
            bold: true,
            size: 20,
            color: '0369A1',
            font: 'Calibri',
          }),
          new TextRun({
            text: skillList,
            size: 20,
            color: '1E293B',
            font: 'Calibri',
          }),
        ],
      })
    );
  });

  // Section 3: Professional Experience Heading
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '0369A1',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'PROFESSIONAL EXPERIENCE',
          bold: true,
          size: 24,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    })
  );

  // Add Experience Items
  pubExp.forEach((exp) => {
    // Role and Company Line
    docChildren.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [
          new TextRun({
            text: exp.role,
            bold: true,
            size: 22,
            color: '0F172A',
            font: 'Calibri',
          }),
          new TextRun({
            text: ` — ${exp.company}`,
            bold: true,
            size: 20,
            color: '0369A1',
            font: 'Calibri',
          }),
        ],
      })
    );

    // Period & Location Line
    docChildren.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `${exp.period}  |  ${exp.location}`,
            italics: true,
            size: 18,
            color: '64748B',
            font: 'Calibri',
          }),
        ],
      })
    );

    // Summary
    if (exp.summary) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: exp.summary,
              size: 20,
              color: '334155',
              font: 'Calibri',
            }),
          ],
        })
      );
    }

    // Deliverables Bullets
    if (exp.deliverables && exp.deliverables.length > 0) {
      exp.deliverables.forEach((item) => {
        docChildren.push(
          new Paragraph({
            spacing: { after: 40 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: item,
                size: 20,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          })
        );
      });
    }
  });

  // Section 4: Education Heading
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '0369A1',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'EDUCATION & ACADEMIC CREDENTIALS',
          bold: true,
          size: 24,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    })
  );

  pubEdu.forEach((edu) => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${edu.degree} in ${edu.field}`,
            bold: true,
            size: 22,
            color: '0F172A',
            font: 'Calibri',
          }),
          new TextRun({
            text: ` — ${edu.institution}`,
            size: 20,
            color: '0369A1',
            font: 'Calibri',
          }),
        ],
      })
    );
    if (edu.researchFocus) {
      docChildren.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `Focus: ${edu.researchFocus}`,
              size: 18,
              color: '475569',
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  });

  // Section 5: Certifications Heading
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: '0369A1',
          space: 2,
        },
      },
      children: [
        new TextRun({
          text: 'PROFESSIONAL CERTIFICATIONS & LICENSES',
          bold: true,
          size: 24,
          color: '0F172A',
          font: 'Calibri',
        }),
      ],
    })
  );

  pubCerts.forEach((cert) => {
    docChildren.push(
      new Paragraph({
        spacing: { after: 40 },
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: `${cert.title} `,
            bold: true,
            size: 20,
            color: '0F172A',
            font: 'Calibri',
          }),
          new TextRun({
            text: `— ${cert.issuer} (${cert.period})`,
            size: 19,
            color: '475569',
            font: 'Calibri',
          }),
        ],
      })
    );
  });

  // Section 6: Awards / Honors if available
  if (pubAwards.length > 0) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: '0369A1',
            space: 2,
          },
        },
        children: [
          new TextRun({
            text: 'HONORS & AWARDS',
            bold: true,
            size: 24,
            color: '0F172A',
            font: 'Calibri',
          }),
        ],
      })
    );
    pubAwards.forEach((award) => {
      docChildren.push(
        new Paragraph({
          spacing: { after: 40 },
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: `${award.title} (${award.year}) `,
              bold: true,
              size: 20,
              color: '0F172A',
              font: 'Calibri',
            }),
            new TextRun({
              text: `— ${award.conferrer}: ${award.description}`,
              size: 19,
              color: '475569',
              font: 'Calibri',
            }),
          ],
        })
      );
    });
  }

  // Section 7: Languages
  if (pubLangs.length > 0) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 80 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: '0369A1',
            space: 2,
          },
        },
        children: [
          new TextRun({
            text: 'LANGUAGES',
            bold: true,
            size: 24,
            color: '0F172A',
            font: 'Calibri',
          }),
        ],
      })
    );
    const langStr = pubLangs.map((l) => `${l.language}: ${l.proficiency}`).join('  |  ');
    docChildren.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: langStr,
            size: 20,
            color: '1E293B',
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = profile.fullName.replace(/\s+/g, '_');
  const filename = `${cleanName}_Resume.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadResumePdf(content: PortfolioContentState): Promise<void> {
  const { profile, experience, education, skillDomains, certifications, awards, languages } = content;

  const pubExp = experience.filter((e) => e.published !== false);
  const pubEdu = education.filter((e) => e.published !== false);
  const pubSkills = skillDomains.filter((s) => s.published !== false);
  const pubCerts = certifications.filter((c) => c.published !== false);
  const pubAwards = awards.filter((a) => a.published !== false);
  const pubLangs = languages.filter((l) => l.published !== false);

  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // Primary dark
  doc.text(profile.fullName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 20;

  // Header: Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(3, 105, 161); // Secondary teal/blue
  doc.text(profile.credentialTitle || profile.tagline, pageWidth / 2, y, { align: 'center' });
  y += 16;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const contactStr = `${profile.location}  •  ${profile.phone}  •  ${profile.email}  •  ${profile.linkedIn}`;
  doc.text(contactStr, pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Horizontal divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  // Helper for Section Heading
  const renderSectionHeader = (title: string) => {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
    y += 4;
    doc.setDrawColor(3, 105, 161);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + doc.getTextWidth(title) + 10, y);
    y += 14;
  };

  // Section 1: Professional Summary
  renderSectionHeader('PROFESSIONAL SUMMARY');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  const summary1Lines = doc.splitTextToSize(profile.bio1, contentWidth);
  checkPageBreak(summary1Lines.length * 12 + 10);
  doc.text(summary1Lines, margin, y);
  y += summary1Lines.length * 12 + 6;

  if (profile.bio2) {
    const summary2Lines = doc.splitTextToSize(profile.bio2, contentWidth);
    checkPageBreak(summary2Lines.length * 12 + 10);
    doc.text(summary2Lines, margin, y);
    y += summary2Lines.length * 12 + 12;
  }

  // Section 2: Technical Competencies
  renderSectionHeader('CORE TECHNICAL COMPETENCIES');
  pubSkills.forEach((domain) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(3, 105, 161);
    const domainPrefix = `• ${domain.title}: `;
    doc.text(domainPrefix, margin, y);

    const prefixWidth = doc.getTextWidth(domainPrefix);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const skillList = domain.skills.map((s) => `${s.name} (${s.level})`).join(', ');
    const lines = doc.splitTextToSize(skillList, contentWidth - prefixWidth);
    doc.text(lines, margin + prefixWidth, y);
    y += Math.max(14, lines.length * 12);
  });
  y += 8;

  // Section 3: Professional Experience
  renderSectionHeader('PROFESSIONAL EXPERIENCE');
  pubExp.forEach((exp) => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`${exp.period}  |  ${exp.location}`, pageWidth - margin, y, { align: 'right' });
    y += 13;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(3, 105, 161);
    doc.text(exp.company, margin, y);
    y += 13;

    if (exp.summary) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const sumLines = doc.splitTextToSize(exp.summary, contentWidth);
      checkPageBreak(sumLines.length * 11);
      doc.text(sumLines, margin, y);
      y += sumLines.length * 11 + 4;
    }

    if (exp.deliverables && exp.deliverables.length > 0) {
      exp.deliverables.forEach((item) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        const itemLines = doc.splitTextToSize(`•  ${item}`, contentWidth - 10);
        checkPageBreak(itemLines.length * 11);
        doc.text(itemLines, margin + 5, y);
        y += itemLines.length * 11 + 2;
      });
    }
    y += 8;
  });

  // Section 4: Education
  renderSectionHeader('EDUCATION & ACADEMIC CREDENTIALS');
  pubEdu.forEach((edu) => {
    checkPageBreak(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${edu.degree} in ${edu.field}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(3, 105, 161);
    doc.text(edu.institution, pageWidth - margin, y, { align: 'right' });
    y += 12;

    if (edu.researchFocus) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const focusLines = doc.splitTextToSize(`Focus: ${edu.researchFocus}`, contentWidth);
      doc.text(focusLines, margin, y);
      y += focusLines.length * 10 + 4;
    }
    y += 4;
  });

  // Section 5: Certifications
  renderSectionHeader('PROFESSIONAL CERTIFICATIONS');
  pubCerts.forEach((cert) => {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${cert.title}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${cert.issuer} (${cert.period})`, pageWidth - margin, y, { align: 'right' });
    y += 13;
  });
  y += 6;

  // Section 6: Awards
  if (pubAwards.length > 0) {
    renderSectionHeader('HONORS & AWARDS');
    pubAwards.forEach((award) => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${award.title} (${award.year})`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const awLines = doc.splitTextToSize(`${award.conferrer} - ${award.description}`, contentWidth - 15);
      doc.text(awLines, margin + 10, y + 11);
      y += 11 + awLines.length * 10 + 4;
    });
  }

  // Section 7: Languages
  if (pubLangs.length > 0) {
    renderSectionHeader('LANGUAGES');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const langLine = pubLangs.map((l) => `${l.language}: ${l.proficiency}`).join('    |    ');
    doc.text(langLine, margin, y);
    y += 16;
  }

  const cleanName = profile.fullName.replace(/\s+/g, '_');
  const filename = `${cleanName}_Resume.pdf`;
  doc.save(filename);
}
