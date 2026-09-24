// pages/api/mid-journey/download-pdf.js
import fs from 'fs';
import path from 'path';
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

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

const COLORS = { navy: '#021A35', gold: '#C8A951', ink: '#1A1A1A', muted: '#888888', dim: '#555555' };

// Same base-14-font approach as the Final Blueprint PDF route — no
// external font files to host or embed.
const styles = StyleSheet.create({
  titlePage: { paddingTop: 160, paddingHorizontal: 72, alignItems: 'center' },
  logo: { width: 200, height: 60, marginBottom: 32, objectFit: 'contain' },
  eyebrow: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: COLORS.gold, letterSpacing: 3, marginBottom: 20 },
  archetype: { fontFamily: 'Times-Bold', fontSize: 34, color: COLORS.navy, textAlign: 'center', marginBottom: 16 },
  preparedFor: { fontFamily: 'Times-Italic', fontSize: 14, color: COLORS.dim, marginBottom: 10 },
  orgLine: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: COLORS.gold, letterSpacing: 3, marginBottom: 6, marginTop: 18 },
  dateLine: { fontFamily: 'Helvetica', fontSize: 10, color: COLORS.muted },
  bodyPage: { paddingTop: 56, paddingBottom: 56, paddingHorizontal: 60 },
  heading: { fontFamily: 'Times-Bold', fontSize: 17, color: COLORS.navy, marginTop: 18, marginBottom: 8 },
  paragraph: { fontFamily: 'Helvetica', fontSize: 10.5, lineHeight: 1.55, color: COLORS.ink, marginBottom: 9 },
  italicRun: { fontFamily: 'Helvetica-Oblique', color: COLORS.navy },
  footer: { marginTop: 28, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.gold, alignItems: 'center' },
  footerText: { fontFamily: 'Helvetica', fontSize: 8, color: COLORS.muted },
});

function parseInlineRuns(block) {
  const parts = block.split(/(\*[^*]+\*)/g).filter((p) => p.length > 0);
  return parts.map((part) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return { text: part.slice(1, -1), italic: true };
    }
    return { text: part, italic: false };
  });
}

function MidJourneyDocument({ archetypeDisplay, firstName, generatedDate, logoDataUri, blocks }) {
  return React.createElement(
    Document,
    { creator: 'Awakening Destiny Global', title: `Mid-Journey Blueprint — ${archetypeDisplay}` },
    React.createElement(
      Page,
      { size: 'A4', style: styles.titlePage },
      logoDataUri && React.createElement(Image, { src: logoDataUri, style: styles.logo }),
      React.createElement(Text, { style: styles.eyebrow }, 'MID-JOURNEY BLUEPRINT'),
      React.createElement(Text, { style: styles.archetype }, archetypeDisplay),
      React.createElement(Text, { style: styles.preparedFor }, `Prepared for ${firstName}`),
      React.createElement(Text, { style: styles.orgLine }, 'AWAKENING DESTINY GLOBAL'),
      React.createElement(Text, { style: styles.dateLine }, generatedDate)
    ),
    React.createElement(
      Page,
      { size: 'A4', style: styles.bodyPage },
      ...blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return React.createElement(Text, { key: i, style: styles.heading }, block.replace(/^## /, ''));
        }
        const runs = parseInlineRuns(block);
        return React.createElement(
          Text,
          { key: i, style: styles.paragraph },
          ...runs.map((run, j) =>
            React.createElement(Text, { key: j, style: run.italic ? styles.italicRun : undefined }, run.text)
          )
        );
      }),
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, 'Awakening Destiny Global · awakeningdestiny.global')
      )
    )
  );
}

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
      month: 'long', day: 'numeric', year: 'numeric',
    });

    let logoDataUri = null;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'adg-logo.png');
      const logoBuffer = fs.readFileSync(logoPath);
      logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (e) {
      console.warn('ADG logo not found, skipping:', e.message);
    }

    const blocks = report.content.trim().split(/\n\n+/);

    const buffer = await renderToBuffer(
      React.createElement(MidJourneyDocument, { archetypeDisplay, firstName, generatedDate, logoDataUri, blocks })
    );

    const filename = `mid-journey-blueprint-${firstName.toLowerCase()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Mid-journey PDF download error:', err);
    return res.status(500).json({ error: 'Failed to generate document' });
  }
}
