// pages/coach-preview.js
// Preview page for the public website coaching agent. Mount and test
// without embedding into the live WordPress site yet.

import Head from "next/head";
import WebsiteCoach from "@/components/WebsiteCoach";
import { colors as tok } from "../styles/tokens";

export default function CoachPreview() {
  return (
    <>
      <Head>
        <title>ADG Guide preview</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: tok.cream,
          padding: "48px 24px",
          fontFamily: "'Outfit', sans-serif",
          color: tok.navy,
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", margin: "0 0 12px" }}>
            ADG Website Coaching Guide — Preview
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.6, color: tok.navyMid }}>
            This page is for testing the public-facing coaching agent. The
            floating button in the bottom-right opens the guide. It connects
            to <code>/api/coach/chat</code> with retrieval from the
            <code> coach_chunks </code>knowledge base, captures leads via
            <code> /api/coach/lead</code>, and can email a summary via
            <code> /api/coach/summary</code>.
          </p>
          <p style={{ fontSize: "15px", lineHeight: 1.6, color: tok.navyMid }}>
            Once the migration is applied and at least one document is
            ingested, the guide will start citing real ADG content.
          </p>
        </div>
        <WebsiteCoach />
      </main>
    </>
  );
}
