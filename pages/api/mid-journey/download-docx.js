// pages/api/mid-journey/download-docx.js
import { createClient } from '@supabase/supabase-js';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OFFICE_DISPLAY = {
  apostolic: 'Apostolic', prophetic: 'Prophetic', evangelistic: 'Evangelistic',
  pastoral: 'Pastoral', teaching: 'Teaching',
};
const OVERLAY_DISPLAY = {
  builder: 'Builder', burden_bearer: 'Burden Bearer', reformer: 'Reformer',
  covenant_keeper: 'Covenant Keeper', equipper: 'Equipper',
};

const COLORS = { navy: '021A35', gold: 'C8A951', cream: 'FDF8F0', goldBright: 'FDD20D' };
const FONTS = { heading: 'Cormorant Garamond', body: 'Georgia', ui: 'Outfit' };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const { data: report, error } = await supabase
      .from('mid_journey_reports')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const officeName = OFFICE_DISPLAY[report.archetype_office] || report.archetype_office;
    const overlayName = OVERLAY_DISPLAY[report.archetype_overlay] || report.archetype_overlay;
    const archetypeDisplay = `The ${officeName} ${overlayName}`;
    const firstName = report.input_payload?.firstName || 'Leader';
    const generatedDate = new Date(report.generated_at).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });

    const children = [];

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2400, after: 200 },
        children: [new TextRun({ text: 'MID-JOURNEY BLUEPRINT', font: FONTS.ui, size: 20, color: COLORS.gold, bold: true, characterSpacing: 40 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: archetypeDisplay, font: FONTS.heading, size: 64, color: COLORS.navy })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 800 },
        children: [new TextRun({ text: `Prepared for ${firstName}`, font: FONTS.body, size: 24, italics: true, color: '555555' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 },
        children: [new TextRun({ text: 'AWAKENING DESTINY GLOBAL', font: FONTS.ui, size: 18, color: COLORS.gold, characterSpacing: 40 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: generatedDate, font: FONTS.ui, size: 18, color: '888888' })],
      }),
      new Paragraph({ children: [new PageBreak()] }),
    );

    const blocks = report.content.trim().split(/\n\n+/);
    for (const block of blocks) {
      if (block.startsWith('## ')) {
        children.push(
          new Paragraph({
            spacing: { before: 400, after: 200 },
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: block.replace(/^## /, ''), font: FONTS.heading, size: 36, color: COLORS.navy, bold: true })],
          })
        );
      } else {
        const parts = block.split(/(\*[^*]+\*)/g);
        const runs = parts.filter(p => p.length > 0).map(part => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return new TextRun({ text: part.slice(1, -1), font: FONTS.body, size: 22, italics: true, color: COLORS.navy });
          }
          return new TextRun({ text: part, font: FONTS.body, size: 22, color: '1A1A1A' });
        });
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 180, line: 360 },
            children: runs,
          })
        );
      }
    }

    children.push(
      new Paragraph({ spacing: { before: 800 }, children: [new TextRun({ text: '', size: 2 })] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { color: COLORS.gold, space: 1, style: 'single', size: 6 } },
        spacing: { before: 400 },
        children: [new TextRun({ text: 'Awakening Destiny Global · awakeningdestiny.global', font: FONTS.ui, size: 16, color: '888888' })],
      }),
    );

    const doc = new Document({
      creator: 'Awakening Destiny Global',
      title: `Mid-Journey Blueprint — ${archetypeDisplay}`,
      description: 'Prophetic-strategic Kingdom leadership formation report',
      styles: { default: { document: { run: { font: FONTS.body, size: 22 } } } },
      sections: [{
        properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `mid-journey-blueprint-${firstName.toLowerCase()}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Download docx error:', err);
    return res.status(500).json({ error: 'Failed to generate document' });
  }
}