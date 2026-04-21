// lib/called-to-carry/email/resend.js
// Resend client wrapper for Called to Carry email sends.
// Server-side only — never imported in client components.

import { Resend } from 'resend';

let _client = null;

function getResendClient() {
  if (!_client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    _client = new Resend(process.env.RESEND_API_KEY);
  }
  return _client;
}

/**
 * Send a single email via Resend.
 *
 * @param {{ to: string, subject: string, html: string, text: string, replyTo?: string }} opts
 * @returns {Promise<{ id: string }>}
 */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'will@awakeningdestiny.global',
    reply_to: replyTo || process.env.RESEND_REPLY_TO || 'will@awakeningdestiny.global',
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return { id: data.id };
}
