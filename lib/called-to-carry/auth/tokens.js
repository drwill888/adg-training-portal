// lib/called-to-carry/auth/tokens.js
// Signed token generation and verification for one-click unsubscribe links.
// Uses HMAC-SHA256 with UNSUBSCRIBE_SECRET env var.
// Server-side only.

import crypto from 'crypto';

function getSecret() {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET environment variable is not set');
  return secret;
}

/**
 * Build a signed one-click unsubscribe URL for a given email_sequences row.
 * @param {string} sequenceId
 * @returns {string}
 */
export function buildUnsubscribeUrl(sequenceId) {
  const token = signToken(sequenceId);
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://calledtocarry.awakeningdestiny.global';
  return `${base}/api/called-to-carry/assessment/unsubscribe?sid=${sequenceId}&token=${token}`;
}

/**
 * Sign a value with HMAC-SHA256.
 * @param {string} value
 * @returns {string} hex digest
 */
export function signToken(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex');
}

/**
 * Verify a token matches the expected value.
 * Uses constant-time comparison to prevent timing attacks.
 * @param {string} value
 * @param {string} token
 * @returns {boolean}
 */
export function verifyToken(value, token) {
  const expected = signToken(value);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(token, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Hash an IP address with SHA256 for privacy-safe storage.
 * @param {string} ip
 * @returns {string} hex digest
 */
export function hashIp(ip) {
  return crypto.createHash('sha256').update(ip || 'unknown').digest('hex');
}
