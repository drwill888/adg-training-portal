// lib/mid-journey/prompts.js
// Prompt builders for the Mid-Journey Blueprint Report.
// Two tiers: FULL (Cohort + Blueprint) and LIGHT (Self-Paced).

const VOICE_RULES = `VOICE RULES — follow all of these absolutely:
- Apostolic-prophetic register. Declarative. Scripture-anchored.
- Do not cite external authorities or thought leaders.
- Second person throughout ("You are...", "You have...").
- Italicize scripture quotations using *asterisks*.
- Short sentence rhythm. Punchy. No fluff.
- Name what is true. Don't suggest what might be true.
- No bullet points. No numbered lists. Prose only.
- Do not hedge ("perhaps", "maybe", "it seems") — this voice speaks identity.
- Do not open with niceties or invocations. Open with the statement itself.`;

export function buildFullReportPrompt(data) {
  return `You are writing a prophetic-strategic Mid-Journey Blueprint report for a Kingdom leader 
who has completed four of seven modules in the 5C Leadership Blueprint. You are writing as if 
you know this leader personally and are speaking identity over them based on the data provided.

${VOICE_RULES}

LEADER CONTEXT

First name: ${data.firstName || 'the leader'}

Called to Carry Archetype: ${data.archetype.name}
Archetype subtitle: ${data.archetype.subtitle}

Archetype content — Who You Are:
${(data.archetype.whoYouAre || []).join('\n\n')}

Archetype Assignment:
${data.archetype.assignment}

Archetype Strength:
${data.archetype.strength}

Archetype Temptation:
${data.archetype.temptation}

Archetype Scripture:
"${data.archetype.scripture}" — ${data.archetype.scriptureRef}

${data.strengthsFinder ? `StrengthsFinder themes: ${data.strengthsFinder.join(', ')}` : ''}

MODULE DATA — Calling, Connection, Competency, Capacity

${formatModuleBlock('Calling', data.modules.calling)}

${formatModuleBlock('Connection', data.modules.connection)}

${formatModuleBlock('Competency', data.modules.competency)}

${formatModuleBlock('Capacity', data.modules.capacity)}

YOUR ASSIGNMENT

Write a report with these exact 5 section headings (use markdown ## for each heading):

## Who You've Become
Integrate the archetype with what's surfaced in the first four modules. Name the version of them 
the journey has produced. 2-3 paragraphs.

## What the Modules Have Surfaced  
Identify 2-3 patterns across their reflections. Quote short phrases from their own writing where 
relevant (in "double quotes"). Name what the data reveals that they may not yet have named 
themselves. 3-4 paragraphs.

## Your Formation Edges
Identify where their archetype temptation and their 5C score gap intersect. Name the specific 
formation work — not generic advice, but the precise place the framework is pressing against them. 
2-3 paragraphs.

## The Work Ahead
Frame the remaining two modules (Convergence and Commissioning) in light of everything above. 
What are they being prepared for? What must still be done before Commissioning? 2 paragraphs.

## Scripture for This Stretch
Use the archetype's canonical scripture as the first anchor. Add ONE additional scripture that 
speaks to the formation edge identified above. Cite both references. For each: italicize the 
quote, then give 1-2 sentences framing why it's for THIS specific stretch.

Total length: 900-1200 words. Output only the report itself — no preamble, no metadata.`;
}

export function buildLightReportPrompt(data) {
  return `You are writing a brief Mid-Journey reflection for a Kingdom leader who has completed 
four modules of the 5C Leadership Blueprint self-paced track. This is a light version — 
personal, real, but compact.

${VOICE_RULES}

LEADER CONTEXT

First name: ${data.firstName || 'the leader'}

Called to Carry Archetype: ${data.archetype.name}
Archetype Temptation: ${data.archetype.temptation}
Archetype Scripture: "${data.archetype.scripture}" — ${data.archetype.scriptureRef}

5C Scores (post-module):
- Calling: ${data.scoresPostByModule.calling || 'incomplete'}
- Connection: ${data.scoresPostByModule.connection || 'incomplete'}
- Competency: ${data.scoresPostByModule.competency || 'incomplete'}
- Capacity: ${data.scoresPostByModule.capacity || 'incomplete'}

Top strength dimension: ${data.topStrength.name} (${data.topStrength.score}/25)
Top gap dimension: ${data.topGap.name} (${data.topGap.score}/25)

YOUR ASSIGNMENT

Write a short report with these exact 4 section headings (use markdown ## for each heading):

## Your Archetype in Brief
2-3 sentences naming what their archetype carries.

## Your Top Strength  
Name ${data.topStrength.name}. 2 sentences on what the strength reveals about them.

## Your Top Gap
Name ${data.topGap.name}. 2 sentences on what the next formation work is, connecting it to the 
archetype's temptation if relevant.

## Scripture Anchor
Use the archetype's scripture. Italicize the quote. 1 sentence framing why it speaks to this 
stretch.

Total length: 300-400 words. Output only the report itself — no preamble, no metadata.`;
}

function formatModuleBlock(name, moduleData) {
  if (!moduleData) return `${name}: [no data recorded]`;

  const reflections = moduleData.reflections
    ? Object.entries(moduleData.reflections)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `  - ${k}: "${v}"`)
        .join('\n')
    : '[no reflections]';

  const commitments = moduleData.commitments
    ? Object.entries(moduleData.commitments)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `  - ${k}: "${v}"`)
        .join('\n')
    : '[no commitments]';

  return `${name.toUpperCase()} MODULE
Pre-score: ${moduleData.preScore ?? 'n/a'} / Post-score: ${moduleData.postScore ?? 'n/a'} / Delta: ${moduleData.delta ?? 'n/a'}

Reflections they wrote:
${reflections}

Commitments they declared:
${commitments}`;
}