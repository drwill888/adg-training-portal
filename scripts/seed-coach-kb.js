#!/usr/bin/env node
// scripts/seed-coach-kb.js
//
// Seed the public website coaching agent's knowledge base with a
// starter set of documents (ADG overview, 5C framework, cohort, coaching,
// speaking, FAQ). Safe to re-run — it inserts new document rows each
// time, so prune old ones in Supabase before re-seeding if you want a
// clean slate.
//
// Usage:
//   COACH_INGEST_URL=https://your-domain.com/api/coach/ingest \
//   COACH_INGEST_TOKEN=... \
//   node scripts/seed-coach-kb.js
//
// For local dev:
//   COACH_INGEST_URL=http://localhost:3000/api/coach/ingest \
//   COACH_INGEST_TOKEN=dev \
//   node scripts/seed-coach-kb.js

const url = process.env.COACH_INGEST_URL;
const token = process.env.COACH_INGEST_TOKEN;

if (!url || !token) {
  console.error("Set COACH_INGEST_URL and COACH_INGEST_TOKEN env vars.");
  process.exit(1);
}

const DOCS = [
  {
    title: "About Awakening Destiny Global",
    category: "about",
    text: `Awakening Destiny Global (ADG) exists to awaken, train, and release Kingdom leaders into their God-given destiny. Founded by Will Meier, ADG serves apostolic and prophetic leaders, marketplace entrepreneurs, ministry founders, coaches, and faithful builders who sense a call beyond business as usual.

Our work is shaped by a few convictions. Leadership is not limited to titles or platforms — it includes stewardship, influence, responsibility, service, and faithful action. Spiritual formation and practical competency belong together. Calling is discovered in community, not in isolation. And destiny is fulfilled across a lifetime of steady, Spirit-led growth, not in a single breakthrough moment.

ADG offers training, coaching, cohort experiences, and resources designed to move leaders from misalignment to alignment, from striving to flow, and from scattered effort to convergence.`,
  },
  {
    title: "The 5C Leadership Blueprint",
    category: "5c",
    text: `The 5C Leadership Blueprint is the core framework taught by Awakening Destiny Global. It names five dimensions every Kingdom leader must develop to walk in fullness: Calling, Connection, Competency, Capacity, and Convergence.

Calling is identity and assignment. It answers the questions: Who has God made me to be, and what am I uniquely entrusted to do? Calling is discerned through prophetic confirmation, personal history, gifting, burdens, and the steady voice of God.

Connection is relational health — vertical and horizontal. It includes intimacy with God, sonship and daughterhood, fathering and mothering, team dynamics, honor culture, and unity. Without Connection, Calling becomes performance.

Competency is skill, gifting, stewardship, and faithful execution. It is the readiness to actually do the work the calling requires. Competency is built through training, practice, mentoring, and small steady steps.

Capacity is endurance and sustainable strength. It includes growth mindset, expanding influence, resilience, margin, and the ability to carry weight over time without breaking. Capacity protects calling from collapse.

Convergence is integration and legacy. It is the season where the other four Cs come together and the leader walks in alignment, fruitfulness, and multi-generational impact. Convergence is not a finish line; it is a way of leading.

Most leaders are stronger in one or two Cs and underdeveloped in others. Real growth happens when you identify which C is the bottleneck in the current season and develop it intentionally.`,
  },
  {
    title: "The Apostolic Cohort",
    category: "cohort",
    text: `The Apostolic Cohort is a small-group, multi-month leadership experience built around the 5C Leadership Blueprint. It is designed for serious leaders — apostolic and prophetic builders, ministry founders, marketplace entrepreneurs, and seasoned coaches — who want growth in community rather than another solo course.

Cohort members work through each of the five Cs together with Will Meier and the ADG team. The rhythm includes group teaching sessions, peer interaction, personal application, and prophetic ministry. Leaders leave with greater clarity on calling, stronger relational health, sharper competency, deeper capacity, and movement toward convergence.

The cohort is intentionally limited in size to protect the depth of relationship. Application and a short discovery conversation are part of the entry path so that fit, timing, and expectations are clear on both sides.

To learn more or apply, reach out through the contact path on awakeningdestiny.global.`,
  },
  {
    title: "Coaching with Will Meier",
    category: "coaching",
    text: `Will Meier offers one-on-one and small-group coaching for apostolic and prophetic leaders, ministry founders, and faithful builders who want personal guidance through their current season.

Coaching uses the 5C Leadership Blueprint as a diagnostic and growth framework. A typical engagement begins with a discovery conversation to clarify the leader's current bottleneck (Calling, Connection, Competency, Capacity, or Convergence), establish goals for the season, and confirm fit. From there, coaching focuses on the most relevant dimension while staying alert to the others.

Coaching is appropriate for leaders who are willing to be honest about where they are, who are open to prophetic input, and who are ready to take action between sessions. It is not a quick fix; it is a steady partnership.

To explore coaching, request a discovery call through the contact path on the website.`,
  },
  {
    title: "Training and Self-Paced Resources",
    category: "training",
    text: `Awakening Destiny Global offers self-paced training modules built around the 5C Leadership Blueprint. The modules walk learners through Calling, Connection, Competency, Capacity, Convergence, and Commissioning, with practical exercises, reflection prompts, and worksheets.

Self-paced training is a good starting point for leaders who want to engage the 5C framework before stepping into the cohort or coaching, or for leaders whose season calls for personal study rather than group rhythm.

Cohort members and coaching clients can also access the self-paced training as part of their experience.`,
  },
  {
    title: "Speaking and Events",
    category: "speaking",
    text: `Will Meier speaks at conferences, leadership gatherings, apostolic and prophetic events, and church or marketplace settings. Speaking topics include the 5C Leadership Blueprint, apostolic leadership, prophetic culture, building healthy teams, sustainable capacity, and walking in alignment with calling.

To inquire about a speaking engagement, please reach out through the contact path on awakeningdestiny.global with the event date, audience, format, and topic you have in mind. The ADG team will follow up to discuss fit and availability.`,
  },
  {
    title: "Frequently asked questions",
    category: "faq",
    text: `Where should I start?
If you are new to ADG, start by learning the 5C Leadership Blueprint. From there, the right next step depends on your season — self-paced training for personal study, coaching for one-on-one guidance, or the apostolic cohort for growth in community.

Is the cohort right for me?
The cohort is best for serious leaders who already carry responsibility and want intentional growth in community. If you are unsure about fit, the discovery conversation is designed to help both you and the ADG team decide.

Do I have to be in full-time ministry?
No. ADG serves apostolic and prophetic leaders across ministry, marketplace, and the arts. Leadership is not limited to titles.

What is your view of prophecy and the apostolic?
ADG operates with apostolic-prophetic grace — direct but warm, structured but Spirit-led. We honor the gifts of the Spirit and the order of healthy leadership.

How do I contact Will?
Reach out through the contact path on awakeningdestiny.global. The ADG team will respond and route your message appropriately.`,
  },
  {
    title: "Contact and next steps",
    category: "general",
    text: `The best way to get in touch with the Awakening Destiny Global team is through the contact path on awakeningdestiny.global. When you reach out, please share your name, the best email to reach you, what you are exploring (coaching, cohort, training, speaking, or general inquiry), and any context that helps the team route your message well.

If you have already used the website guide, you can ask it to email you a summary of your conversation. The team will see it and follow up.`,
  },
];

async function main() {
  let ok = 0;
  let fail = 0;

  for (const doc of DOCS) {
    process.stdout.write(`Ingesting "${doc.title}"... `);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-coach-ingest-token": token,
        },
        body: JSON.stringify(doc),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`ok (${data.chunksCreated} chunks)`);
        ok++;
      } else {
        console.log(`failed: ${data.error || res.status}`);
        fail++;
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone — ${ok} succeeded, ${fail} failed.`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
