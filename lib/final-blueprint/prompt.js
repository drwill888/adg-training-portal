// lib/final-blueprint/prompts.js
// Prompt builders for the Final 5C Leadership Blueprint Report.
// Generated at Commissioning completion — the capstone document.

const VOICE_RULES = `VOICE RULES — follow all absolutely:
- Apostolic-prophetic register. Declarative. Scripture-anchored.
- Do not cite external authorities or thought leaders.
- Second person throughout ("You are...", "You have...").
- Italicize scripture quotations using *asterisks*.
- Short sentence rhythm. Punchy. No fluff.
- Name what is true. Don't suggest what might be true.
- No bullet points. No numbered lists. Prose only.
- Do not hedge. Do not open with niceties. Open with the statement itself.`;

export function buildFullReportPrompt(data) {
  return `You are writing the Final 5C Leadership Blueprint for a Kingdom leader who has completed all seven modules of the 5C Leadership Blueprint formation journey. This is the capstone document — the most important piece of writing this leader will receive from this program. Write as if you have walked every module with them and are now speaking their full identity and assignment over them.

${VOICE_RULES}

LEADER CONTEXT

First name: ${data.firstName || 'the leader'}
Called to Carry Archetype: ${data.archetype?.name || 'unknown'}
Archetype Office: ${data.archetype?.office || ''}
Archetype Overlay: ${data.archetype?.overlay || ''}

${data.archetype ? `Archetype — Who You Are:
${(data.archetype.whoYouAre || []).join('\n\n')}

Archetype Strength: ${data.archetype.strength || ''}
Archetype Temptation: ${data.archetype.temptation || ''}
Archetype Scripture: "${data.archetype.scripture}" — ${data.archetype.scriptureRef}` : ''}

${data.strengthsFinder ? `StrengthsFinder themes: ${data.strengthsFinder.join(', ')}` : ''}

FULL FORMATION JOURNEY — All 7 Modules

${formatAllModules(data.modules)}

Write the Final Blueprint with these exact 7 section headings (use markdown ## for each):

## Who You Have Become
This is the identity statement of the full journey. Not who they were when they started — who they are now, having been formed by all seven modules. Integrate the archetype with every dimension they have walked through. 3-4 paragraphs. This is the most important section. Make it land.

## Your Formation Journey
A module-by-module synthesis of what was most significant about their growth. Do not simply list the modules — identify the narrative arc. What was the through-line from Introduction to Commissioning? Where did the most significant shifts happen? What did God do across this entire journey? 3 paragraphs.

## Your Strengths Profile
Based on their post-scores across all five dimensions (Calling, Connection, Competency, Capacity, Convergence), name their two strongest dimensions. Not just the scores — interpret what those strengths mean for their specific assignment and archetype. What can they trust in themselves? 2 paragraphs.

## Your Formation Edges
Name the dimensions where the most formation work remains. Do not shame — but do not soften. These are the places where the next chapter of their leadership will press hardest. What must they keep developing? 2 paragraphs.

## Your Assignment
This is the prophetic center of the document. Integrate their archetype (Called to Carry identity), their 5C profile, and the arc of their formation journey into one clear statement of what they are sent to do. Specific. Not generic. Name the KIND of leader they are, the KIND of work they carry, and the KIND of impact they are built to produce. 3 paragraphs.

## The Road Ahead
What does faithful stewardship of this formation look like? What are they being sent back into? This is not a task list — it is a formation charge. The final word before they step into Commissioning. 2 paragraphs.

## Scripture for This Season
Three scriptures. One from their archetype's canonical ground. One that speaks to their primary strength. One that speaks to their deepest formation edge. For each: italicize the quote, cite the reference, then 1-2 sentences on why it is the word for THIS specific leader at THIS specific moment.

Total length: 1500-2000 words. Output only the report — no preamble, no metadata.`;
}

export function buildLightReportPrompt(data) {
  return `You are writing a Final Leadership Blueprint summary for a Kingdom leader who has completed all seven modules of the 5C Leadership Blueprint on the self-paced track.

${VOICE_RULES}

LEADER CONTEXT

First name: ${data.firstName || 'the leader'}
Archetype: ${data.archetype?.name || 'unknown'}

5C Scores (post-module):
- Calling: ${data.scoresPostByModule?.calling || 'incomplete'}
- Connection: ${data.scoresPostByModule?.connection || 'incomplete'}
- Competency: ${data.scoresPostByModule?.competency || 'incomplete'}
- Capacity: ${data.scoresPostByModule?.capacity || 'incomplete'}
- Convergence: ${data.scoresPostByModule?.convergence || 'incomplete'}

Top strength: ${data.topStrength?.name} (${data.topStrength?.score}/25)
Top gap: ${data.topGap?.name} (${data.topGap?.score}/25)
Archetype temptation: ${data.archetype?.temptation || ''}
Archetype scripture: "${data.archetype?.scripture}" — ${data.archetype?.scriptureRef}

Write a 5-section summary with these headings (use markdown ## for each):

## Who You Have Become
3 sentences naming the identity this journey has produced.

## Your Strongest Dimension
Name ${data.topStrength?.name}. 2 sentences on what it reveals about their assignment.

## Your Deepest Formation Edge
Name ${data.topGap?.name}. 2 sentences on what still needs to grow, connecting to the archetype's temptation.

## Your Assignment in Brief
2-3 sentences naming what they are sent to do — specific to their archetype and 5C profile.

## Scripture for This Season
The archetype's canonical scripture. Italicize the quote. 1 sentence on why it anchors this season.

Total length: 400-500 words. Output only the report.`;
}

function formatAllModules(modules) {
  if (!modules) return '[no module data]';
  const moduleNames = {
    introduction: 'INTRODUCTION (Module 0)',
    calling: 'CALLING (Module 1)',
    connection: 'CONNECTION (Module 2)',
    competency: 'COMPETENCY (Module 3)',
    capacity: 'CAPACITY (Module 4)',
    convergence: 'CONVERGENCE (Module 5)',
    commissioning: 'COMMISSIONING (Module 6)',
  };
  return Object.entries(moduleNames).map(([key, label]) => {
    const m = modules[key];
    if (!m) return `${label}: [not completed]`;
    const reflections = m.reflections
      ? Object.entries(m.reflections)
          .filter(([, v]) => v && String(v).trim())
          .map(([k, v]) => `  - ${k}: "${v}"`)
          .join('\n')
      : '[no reflections]';
    const commitments = m.commitments
      ? Object.entries(m.commitments)
          .filter(([, v]) => v && String(v).trim())
          .map(([k, v]) => `  - ${k}: "${v}"`)
          .join('\n')
      : '[no commitments]';
    return `${label}
Pre-score: ${m.preScore ?? 'n/a'} / Post-score: ${m.postScore ?? 'n/a'} / Delta: ${m.delta ?? 'n/a'}
Reflections: ${reflections || '[none]'}
Commitments: ${commitments || '[none]'}
AI Summary excerpt: ${m.aiSummary ? m.aiSummary.slice(0, 300) + '...' : '[none]'}`;
  }).join('\n\n');
}