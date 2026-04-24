// pages/api/logo-base64.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'adg-logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const base64 = logoBuffer.toString('base64');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send('data:image/png;base64,' + base64);
  } catch (err) {
    console.error('Logo base64 error:', err);
    return res.status(404).json({ error: 'Logo not found' });
  }
}