// ═══════════════════════════════════════════════════════════════
// MODULE 2: CONNECTION — Identity (Relationships)
// 5C Leadership Blueprint · Awakening Destiny Global
// ═══════════════════════════════════════════════════════════════
// INTEGRATION:
//   1. Add connectionDiagnostic to your data section
//   2. Add ConnectionPage component
//   3. Add route: case "connection": return <ConnectionPage nav={nav} />;
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
export const connectionDiagnostic = [
  { num: 1,  cat: "Sonship & Identity",       text: "I lead from a settled sense of who I am, not from what I produce." },
  { num: 2,  cat: "Sonship & Identity",       text: "I do not need applause to feel confident in my assignment.", ref: "Matthew 3:17" },
  { num: 3,  cat: "Sonship & Identity",       text: "My identity remains stable when I am criticized or overlooked." },
  { num: 4,  cat: "Discipline & Formation",   text: "I receive correction without defensiveness.", ref: "Hebrews 12:5–11" },
  { num: 5,  cat: "Discipline & Formation",   text: "I see discipline as evidence of love, not rejection." },
  { num: 6,  cat: "Discipline & Formation",   text: "I seek out truth-tellers, not just encouragers." },
  { num: 7,  cat: "Security & Empowerment",   text: "I celebrate when others around me accelerate.", ref: "Philippians 2:3" },
  { num: 8,  cat: "Security & Empowerment",   text: "I freely release responsibility to develop others." },
  { num: 9,  cat: "Security & Empowerment",   text: "I do not hoard influence — I distribute it." },
  { num: 10, cat: "Solitude & Awareness",     text: "I maintain a rhythm of solitude that sustains my leadership.", ref: "Mark 1:35" },
  { num: 11, cat: "Solitude & Awareness",     text: "I can distinguish my own voice from the noise around me." },
  { num: 12, cat: "Solitude & Awareness",     text: "I return to the Father's presence before I return to the platform." },
];


// ═══════════════════════════════════════════════════════════════
// BRAND PALETTE — Awakening Destiny Global
// ═══════════════════════════════════════════════════════════════
const NAVY    = "#021A35";
const ROYAL   = "#0172BC";   // Module 2 accent — Connection
const SKY     = "#00AEEF";   // Lighter brand blue
const GOLD_D  = "#C8A951";
const GOLD    = "#FDD20D";
const ORANGE  = "#F47722";
const RED     = "#EE3124";
const CREAM   = "#FDF8F0";

// Derived from brand blue
const ACCENT       = ROYAL;
const ACCENT_LIGHT = "#E8F4FD";  // very light blue tint
const ACCENT_MID   = SKY;


// ─── STEPS ───────────────────────────────────────────────────
const STEPS = [
  { id: "activation",      label: "Activation" },
  { id: "pre-diagnostic",  label: "Pre-Diagnostic" },
  { id: "teaching",        label: "Core Teaching" },
  { id: "exemplar",        label: "Exemplar" },
  { id: "stages",          label: "Stages" },
  { id: "post-diagnostic", label: "Post-Diagnostic" },
  { id: "commitment",      label: "Commitment" },
  { id: "addendum",        label: "Addendum" },
  { id: "summary",         label: "AI Blueprint" },
];


// ─── ORPHAN VS. SON ──────────────────────────────────────────
const ORPHAN_SON = [
  { dimension: "Identity Source",       orphan: "What I produce",                   son: "Whose I am" },
  { dimension: "Motivation",            orphan: "Performs for approval",             son: "Leads from approval" },
  { dimension: "Response to Failure",   orphan: "Shame and hiding",                 son: "Honest return to the Father" },
  { dimension: "Response to Success",   orphan: "Pride and self-promotion",         son: "Gratitude and stewardship" },
  { dimension: "View of Correction",    orphan: "Punishment / rejection",           son: "Formation / evidence of love" },
  { dimension: "Posture Toward Others", orphan: "Competition and comparison",       son: "Celebration and empowerment" },
  { dimension: "Leadership Style",      orphan: "Control and self-protection",      son: "Release and multiplication" },
  { dimension: "Decision Filter",       orphan: "\"What will people think?\"",      son: "\"What is the Father saying?\"" },
  { dimension: "Under Pressure",        orphan: "Perform harder, prove more",       son: "Return to identity, lead from rest" },
];


// ─── 5 GOVERNING PRINCIPLES ─────────────────────────────────
// Scripture refs matched exactly to the workbook
const PRINCIPLES = [
  {
    num: 1,
    title: "Sonship Precedes Service",
    ref: "Matthew 3:17",
    scripture: "\u201CThis is My beloved Son, with whom I am well pleased.\u201D \u2014 Matthew 3:17",
    paragraphs: [
      "Before miracles. Before public affirmation. Before visible fruit. The Father declared identity. Sonship preceded service. Approval preceded assignment.",
      "Many leaders reverse this order. They serve to earn belonging. They perform to prove identity. They exhaust themselves building platforms that were never meant to replace the Father\u2019s voice. And when the applause fades or the results dry up, they collapse \u2014 because their identity was built on output, not origin.",
      "Sonship is not a feeling. It is a positional reality. You are not beloved because you perform well. You perform well \u2014 eventually \u2014 because you are beloved. The order is non-negotiable. When this truth settles in your bones, it changes how you lead, how you respond to failure, and how you handle seasons of hiddenness."
    ],
    prompt: "Where in your leadership are you still serving to earn approval instead of leading from it?"
  },
  {
    num: 2,
    title: "Sonship Requires Discipline",
    ref: "Hebrews 12:6, 11",
    scripture: "\u201CFor the Lord disciplines the one He loves, and chastises every son whom He receives.\u201D \u2014 Hebrews 12:6",
    paragraphs: [
      "Belonging is not the absence of correction. It is the context for it. The Father does not discipline strangers \u2014 He disciplines sons. If you have never been corrected by God, you should be concerned, not comfortable. Discipline is not rejection dressed in spiritual language. It is formation disguised as friction.",
      "Many leaders interpret correction as punishment. They receive a rebuke from a mentor and withdraw. They encounter a closed door and assume God has abandoned them. They experience a season of pruning and call it failure. But Hebrews is clear: discipline is evidence of legitimacy. It proves you belong to the household.",
      "Connection matures through formative obedience. The leader who cannot receive correction cannot carry greater weight. \u201CFor the moment all discipline seems painful rather than pleasant, but later it yields the peaceful fruit of righteousness.\u201D \u2014 Hebrews 12:11"
    ],
    prompt: "When was the last time you received correction well? When was the last time you resisted it? What was the difference?"
  },
  {
    num: 3,
    title: "Identity Precedes Influence",
    ref: "Galatians 4:7; John 5:19",
    scripture: "\u201CSo you are no longer a slave, but a son, and if a son, then an heir through God.\u201D \u2014 Galatians 4:7",
    paragraphs: [
      "Secure sons do not seek identity through platform. They know who they are before anyone else affirms it. Influence flows from rooted identity \u2014 not the other way around. Leaders unsure of identity attempt to secure it through performance, titles, and visibility. They lead with anxiety. Secure sons lead without it.",
      "This is also where connection becomes a decision-making filter. The question is not just \u201CIs this a good opportunity?\u201D but: \u201CAm I making this decision from security or from insecurity? From sonship or from striving?\u201D",
      "Jesus\u2019 authority was relationally derived. \u201CThe Son can do nothing of His own accord, but only what He sees the Father doing.\u201D \u2014 John 5:19. His power flowed from alignment with the Father, not from independent ambition. Authority without intimacy becomes authoritarian."
    ],
    prompt: "Name a recent decision. Did you make it from security or insecurity? From sonship or striving? How can you tell?"
  },
  {
    num: 4,
    title: "Security Enables Empowerment",
    ref: "Philippians 2:3",
    scripture: "\u201CDo nothing from selfish ambition or conceit, but in humility count others more significant than yourselves.\u201D \u2014 Philippians 2:3",
    paragraphs: [
      "Only secure sons elevate others freely. Insecure leaders compete. Secure leaders release. Insecure leaders hoard influence. Secure leaders multiply it.",
      "Security eliminates comparison. When you know who you belong to, you are not threatened by someone else\u2019s acceleration. You celebrate it. You fund it. You create space for it.",
      "Empowerment is the evidence of sonship maturity. The leader who cannot release others has not yet settled the identity question."
    ],
    prompt: "Who around you is rising? Are you celebrating their growth or feeling threatened by it? What does your honest answer reveal?",
    prompt2: "What responsibility could you release to someone else right now that would develop them \u2014 but you\u2019ve been holding onto?"
  },
  {
    num: 5,
    title: "Solitude Sustains Awareness",
    ref: "Mark 1:35",
    scripture: "\u201CAnd rising very early in the morning, while it was still dark, He departed and went out to a desolate place, and there He prayed.\u201D \u2014 Mark 1:35",
    paragraphs: [
      "Sonship awareness fades in busyness. The noise of leadership \u2014 demands, decisions, crises, opportunities \u2014 can drown out the voice that says \u201CYou are Mine.\u201D",
      "Jesus withdrew early to pray. Not because He was weak. Because He was intentional. Solitude was the rhythm that protected His identity from being consumed by His assignment.",
      "Abiding requires rhythm. Silence protects identity. Solitude renews alignment. Without this rhythm, even the most grounded leader begins to drift from sonship into performance. The calendar fills. The soul empties. And leadership becomes mechanical."
    ],
    prompt: "What is your current rhythm of solitude and communion? Be honest \u2014 is it consistent or has busyness consumed it?",
    prompt2: "What one change to your daily or weekly rhythm would protect your awareness of who you belong to?"
  }
];


// ─── EXEMPLAR: JESUS ─────────────────────────────────────────
const EXEMPLAR = {
  name: "Jesus",
  title: "Son Before Savior",
  refs: "Matthew 3:16\u201317; John 5:19; Hebrews 5:8",
  intro: "Before miracles. Before disciples. Before influence. The Father declared:",
  mainScripture: "\u201CThis is My beloved Son, with whom I am well pleased.\u201D \u2014 Matthew 3:17",
  bodyParagraphs: [
    "Identity preceded ministry. But Scripture also tells us: \u201CAlthough He was a Son, He learned obedience through what He suffered.\u201D \u2014 Hebrews 5:8",
    "Sonship did not eliminate formation. It required obedience. Correction did not threaten identity. Suffering did not negate sonship. Sonship matured through obedience.",
    "Jesus operated from a clear relational pattern:",
  ],
  arc: [
    { stage: "Belovedness",  text: "The Father speaks identity before assignment." },
    { stage: "Alignment",    text: "Forty days in the wilderness \u2014 every temptation targeted His identity. He refused to prove sonship through performance." },
    { stage: "Obedience",    text: "He did nothing of His own accord, but only what He saw the Father doing." },
    { stage: "Authority",    text: "Because His identity was settled, His authority was unshakeable. He washed feet without losing dignity." },
    { stage: "Impact",       text: "He sent others out with His full authority \u2014 not a diminished version. Security multiplied into movement." },
  ],
  closingScripture: "\u201CThe Son can do nothing of His own accord, but only what He sees the Father doing.\u201D \u2014 John 5:19",
  closingLine: "Authority flowed from intimacy. Power flowed from alignment. True authority flows from relational alignment \u2014 not positional control.",
  coachingQuestions: [
    "Do you lead from approval or for approval?",
    "Do you interpret discipline as rejection \u2014 or formation?",
    "Is your authority rooted in intimacy or activity?",
    "When suffering or correction comes, does your identity remain stable?",
  ]
};


// ─── THREE STAGES ────────────────────────────────────────────
const STAGES = [
  {
    name: "Revelation of Belonging",
    description: "The first encounter with belonging. The moment you hear the Father\u2019s voice over your life \u2014 not as theology, but as experience. Something shifts from knowing about sonship to knowing it in your bones.",
    ref: "Romans 8:15",
  },
  {
    name: "Formation Through Discipline",
    description: "Receiving correction, discipline, and alignment. Learning that love includes refinement. This is where most leaders either deepen or disconnect \u2014 because discipline feels like rejection until your theology catches up.",
    ref: "Hebrews 12:11",
  },
  {
    name: "Mature Sonship",
    description: "Operating from secure identity shaped through discipline. Leading from rest, not striving. Celebrating others without threat. Releasing influence without fear. This is not perfection \u2014 it is settledness.",
    ref: "John 15:4",
  }
];


// ─── KEY SCRIPTURES ──────────────────────────────────────────
const KEY_SCRIPTURES = [
  { ref: "Matthew 3:17",       note: "The Father declares identity before ministry begins." },
  { ref: "Romans 8:15\u201317",     note: "You have received the Spirit of adoption as sons." },
  { ref: "Galatians 4:6\u20137",    note: "No longer a slave, but a son \u2014 and an heir through God." },
  { ref: "John 15:4\u20135",        note: "Abide in Me. Apart from Me you can do nothing." },
  { ref: "John 5:19",          note: "The Son does nothing of His own accord." },
  { ref: "Hebrews 12:5\u201311",    note: "The Lord disciplines the one He loves." },
  { ref: "Proverbs 3:11\u201312",   note: "Do not despise the Lord\u2019s discipline." },
  { ref: "1 John 3:1",         note: "See what kind of love the Father has given to us." },
  { ref: "1 John 4:16",        note: "Whoever abides in love abides in God." },
  { ref: "Mark 1:35",          note: "Rising early, He went to a desolate place and prayed." },
];


// ─── COMMITMENT FIELDS ──────────────────────────────────────
const COMMITMENT_PROMPTS = [
  { id: "identity",       label: "1. My Identity Statement",              placeholder: "Write one sentence that captures who you are in God \u2014 apart from title, role, or accomplishment." },
  { id: "assignment",     label: "2. My Current Relational Assignment",   placeholder: "Name the specific people, team, or community you are called to be rooted with in this season. Who has God placed around you right now?" },
  { id: "orphan",         label: "3. My Orphan Pattern",                  placeholder: "Name the orphan behavior you default to under pressure. Be specific. Where do you strive, compare, control, or perform?" },
  { id: "rhythm",         label: "4. My Sonship Rhythm",                  placeholder: "What specific practice will you commit to this week that protects your connection with God? (Solitude, prayer, worship, silence, journaling?)" },
  { id: "nextstep",       label: "5. My Next Step",                       placeholder: "What one action will you take within 7 days to lead more from sonship and less from striving?" },
  { id: "accountability", label: "6. My Accountability",                  placeholder: "Who will you share this with? Who can ask you the hard questions about identity and belonging?" },
];


// ─── LIVING RHYTHM TRIGGERS ──────────────────────────────────
const REVISIT_TRIGGERS = [
  "When you notice striving replacing rest",
  "When criticism destabilizes your confidence",
  "When you start performing for approval again",
  "When your solitude rhythm breaks down",
  "When comparison or competition surfaces",
  "Quarterly, as a discipline of awareness",
];


// ─── APPLICATION MOMENT QUESTIONS ────────────────────────────
const APPLICATION_QUESTIONS = [
  "Where do I lead from insecurity or comparison?",
  "Where am I trying to prove myself instead of serve from confidence?",
  "What would change this month if I led from anchored identity?",
];


// ─── ADDENDUM: WORK THE NET ──────────────────────────────────
const WORK_THE_NET = {
  title: "Work the Net to Build the Network",
  scriptures: [
    { text: "\u201CTwo are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow.\u201D", ref: "Ecclesiastes 4:9\u201310" },
    { text: "\u201CIron sharpens iron, and one man sharpens another.\u201D", ref: "Proverbs 27:17" },
    { text: "\u201CHe who walks with wise men becomes wise, but the companion of fools will suffer harm.\u201D", ref: "Proverbs 13:20" },
  ],
  paragraphs: [
    "Connection is not passive. You do not build a network by waiting for relationships to find you. You build it by working the net \u2014 intentionally pursuing, cultivating, and stewarding the relationships God assigns to your life.",
    "A net is made of individual threads woven together with purpose. Each thread is a relationship. Each knot is a point of trust. The strength of the net is not determined by how many threads exist \u2014 but by how well they are connected. A net with holes catches nothing.",
    "Working the net means showing up before you need something. It means giving before you ask. It means following up, following through, and being the kind of connection others can count on. Leaders who only reach out when they need something do not have a network \u2014 they have a contact list.",
    "The quality of your network will determine your level of influence. You will not rise beyond the strength of the relationships around you. Weak networks produce isolated leaders. Strong networks produce sustained impact. The people you are connected to shape what you can build, where you can reach, and how far your assignment can travel.",
  ],
  prompt: "Are you intentionally building your network \u2014 or waiting for relationships to happen? What would it look like to \u201Cwork the net\u201D over the next 90 days?",
};


// ─── ADDENDUM: RELATIONAL ORBITS ─────────────────────────────
const RELATIONAL_ORBITS = {
  title: "Relationships Orbit at Different Frequencies",
  scriptures: [
    { text: "\u201CAnd He appointed twelve that they might be with Him and that He might send them out.\u201D", ref: "Mark 3:14" },
    { text: "\u201CFor the body does not consist of one member but of many.\u201D", ref: "1 Corinthians 12:14" },
  ],
  paragraphs: [
    "Jesus had crowds. He had the seventy-two. He had the twelve. He had the three. He had the one. Not every relationship operated at the same frequency \u2014 and neither will yours.",
    "The people in your network orbit your life at different rhythms, and each orbit serves a distinct purpose: Some relationships exist to give into you \u2014 prophetic words, encouragement, correction, wisdom. Some exist for you to pour into \u2014 mentoring, equipping, activating. Some are mutual exchange. The mature leader discerns which orbit each relationship belongs in and stewards accordingly.",
    "The mistake most leaders make is treating every relationship with the same frequency. They exhaust themselves trying to maintain inner-circle depth with everyone \u2014 or they neglect key relationships because they have no system for staying connected. Both produce relational poverty.",
    "Not every person in your network needs weekly access. But every person in your network needs intentional stewardship. Know who belongs in each orbit. Know what each relationship carries. And protect the rhythm that keeps your net strong.",
  ],
  prompt: "Map your current network using the orbit framework. Who is in your inner circle? Your core alliance? Your seasonal connectors? Where are the gaps \u2014 and where are you over-investing or under-investing?",
  prompt2: "Who in your network needs a different frequency than what you are currently giving them? Who have you neglected \u2014 and who needs to be repositioned?",
};


// ═══════════════════════════════════════════════════════════════
// CONNECTION PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ConnectionPage({ nav }) {
  const [step, setStep] = useState(0);
  const [preScores, setPreScores] = useState({});
  const [postScores, setPostScores] = useState({});
  const [responses, setResponses] = useState({});
  const [commitments, setCommitments] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedPrinciple, setExpandedPrinciple] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  const currentStep = STEPS[step];

  const setScore = (target, num, val) => {
    if (target === "pre")  setPreScores(p => ({ ...p, [num]: val }));
    if (target === "post") setPostScores(p => ({ ...p, [num]: val }));
  };

  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const getInterpretation = (total) => {
    if (total >= 50) return { range: "50\u201360", text: "Deep security. Lead from identity and multiply.", color: ACCENT };
    if (total >= 40) return { range: "40\u201349", text: "Growing security. Strengthen rhythms and vulnerability.", color: ORANGE };
    if (total >= 30) return { range: "30\u201339", text: "Orphan patterns surfacing. Intentional formation needed.", color: RED };
    return { range: "Below 30", text: "Identity crisis. Prioritize belonging, mentoring, and healing.", color: "#991B1B" };
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom leadership coach analyzing a leader's Connection diagnostic and reflections from the 5C Leadership Blueprint by Awakening Destiny Global.

MODULE: Connection — Identity (Relationships)
CENTRAL QUESTION: "Whose am I?"

PRE-DIAGNOSTIC SCORES (before teaching):
${connectionDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${preScores[q.num] || "N/A"}/5`).join("\n")}
Pre-Total: ${totalScore(preScores)}/60

POST-DIAGNOSTIC SCORES (after teaching):
${connectionDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${postScores[q.num] || "N/A"}/5`).join("\n")}
Post-Total: ${totalScore(postScores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Connection Blueprint (400–500 words) that:
1. Identifies their strongest category and their most vulnerable category across both diagnostics
2. Names the shift (or lack of shift) between pre and post scores — what moved, what stayed stuck
3. Addresses their orphan pattern honestly and with compassion
4. Connects their identity statement to their current relational assignment
5. Gives 2–3 specific, actionable recommendations rooted in the five Connection principles
6. Closes with a prophetic encouragement about their identity in the Father

Write in second person ("you"). Tone: direct, warm, apostolic — like a trusted mentor who sees both strength and weakness. Use Scripture references naturally. Do not use bullet points — write in flowing paragraphs.`;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiSummary(data.response || data.content?.[0]?.text || "Summary generation failed.");
    } catch (err) {
      setAiSummary("Unable to generate summary. Please check your connection and try again.");
    }
    setLoading(false);
  };


  // ─── SHARED COMPONENTS ──────────────────────────────────────

  const Scripture = ({ children }) => (
    <div className="my-4 py-3 px-4 rounded-lg border-l-4" style={{ borderColor: GOLD_D, background: CREAM }}>
      <p className="italic text-sm leading-relaxed" style={{ color: NAVY }}>{children}</p>
    </div>
  );

  const Reflect = ({ id, prompt, placeholder }) => (
    <div className="mt-5 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-5 rounded-full" style={{ background: GOLD_D }} />
        <p className="text-sm font-semibold tracking-wide" style={{ color: GOLD_D }}>PAUSE & PROCESS</p>
      </div>
      <p className="text-sm mb-3 italic leading-relaxed" style={{ color: "#444" }}>{prompt}</p>
      <textarea
        className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all"
        style={{ borderColor: "#ddd", minHeight: "100px", focusRingColor: ACCENT }}
        placeholder={placeholder || "Write your reflection here..."}
        value={responses[id] || ""}
        onChange={e => setResponses(r => ({ ...r, [id]: e.target.value }))}
      />
    </div>
  );

  const SectionHead = ({ children, sub }) => (
    <div className="mb-4">
      <h3 className="text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>
        {children}
      </h3>
      {sub && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>{sub}</p>}
    </div>
  );


  // ─── DIAGNOSTIC TABLE ───────────────────────────────────────
  const renderDiagnostic = (target, scoreObj) => {
    const categories = [...new Set(connectionDiagnostic.map(q => q.cat))];
    return (
      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat}>
            <div className="px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>
              {cat}
            </div>
            <div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>
              {connectionDiagnostic.filter(q => q.cat === cat).map(q => (
                <div key={q.num} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-xs font-mono mt-1 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>
                    {q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        onClick={() => setScore(target, q.num, v)}
                        className="w-8 h-8 rounded-full text-xs font-bold transition-all duration-200"
                        style={{
                          background: scoreObj[q.num] === v ? ACCENT : "transparent",
                          color: scoreObj[q.num] === v ? "#fff" : "#999",
                          border: `2px solid ${scoreObj[q.num] === v ? ACCENT : "#e0e0e0"}`,
                        }}
                      >{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Total */}
        <div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scoreObj)} / 60</span>
            <span className="text-sm font-medium" style={{ color: getInterpretation(totalScore(scoreObj)).color }}>
              {getInterpretation(totalScore(scoreObj)).text}
            </span>
          </div>
        </div>
      </div>
    );
  };


  // ═══════════════════════════════════════════════════════════
  // RENDER EACH STEP
  // ═══════════════════════════════════════════════════════════

  const renderStep = () => {
    switch (currentStep.id) {

      // ─── ACTIVATION ───────────────────────────────────────
      case "activation":
        return (
          <div className="space-y-6">
            {/* 5C Lifecycle Context */}
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD_D }}>THE 5C LEADERSHIP LIFECYCLE</p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>
                In Module 1, we established Calling \u2014 the foundation of your design and purpose. Now we move to the dimension that anchors everything calling sets in motion.
              </p>
              <div className="flex gap-1 overflow-x-auto py-2">
                {["CALLING","CONNECTION","COMPETENCY","CAPACITY","CONVERGENCE"].map((c, i) => (
                  <div key={c} className="px-3 py-2 rounded-lg text-center text-xs font-bold tracking-wide shrink-0" style={{
                    background: i === 1 ? NAVY : i === 0 ? ACCENT_LIGHT : "#f5f5f0",
                    color: i === 1 ? "#fff" : i === 0 ? ACCENT : "#999",
                    minWidth: "90px",
                  }}>{c}</div>
                ))}
              </div>
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#333" }}>
                Calling answers: <em>Who was I designed to become?</em><br/>
                Connection answers the next essential question: <strong style={{ color: NAVY }}>Whose am I?</strong>
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "#333" }}>
                Calling gives <em>direction</em>. Connection gives <em>security</em>. Without connection, calling becomes exhausting. With it, assignment becomes sustainable.
              </p>
            </div>

            {/* Hook */}
            <div className="p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
              <p className="text-lg italic leading-relaxed" style={{ color: NAVY }}>
                "You can know what you\u2019re built for and still collapse \u2014 if you don\u2019t know who you belong to."
              </p>
            </div>

            {/* Prompts */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>OPENING ACTIVATION</p>
              <p className="text-sm italic mb-4" style={{ color: "#666" }}>Before we teach, we listen. Sit with these questions for three minutes. Write what surfaces \u2014 not what sounds right.</p>
              <Reflect id="activation_1" prompt="When was the last time you felt truly secure in who you are \u2014 not because of what you accomplished, but simply because of who you belong to?" />
              <Reflect id="activation_2" prompt="Where in your leadership right now are you performing for approval instead of leading from approval?" />
            </div>
          </div>
        );


      // ─── PRE-DIAGNOSTIC ───────────────────────────────────
      case "pre-diagnostic":
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="font-semibold mb-1" style={{ color: NAVY }}>Connection Diagnostic \u2014 Pre-Assessment</p>
              <p className="text-sm" style={{ color: "#666" }}>
                Rate each statement honestly from 1 (Strongly Disagree) to 5 (Strongly Agree). This is a mirror, not a test. Let it reveal where you are so you can grow from truth.
              </p>
            </div>
            {renderDiagnostic("pre", preScores)}
            <Reflect id="pre_diag_reflection" prompt="Look at your lowest category. What does it tell you about where your identity is still under construction?" />
          </div>
        );


      // ─── CORE TEACHING ────────────────────────────────────
      case "teaching":
        return (
          <div className="space-y-10">

            {/* ── DEFINITION ── */}
            <div>
              <SectionHead>Definition</SectionHead>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>
                Connection is relational alignment with God that establishes identity through sonship before function. It is <strong>belonging</strong> before burden. Union before utility.
              </p>
              <Scripture>{"\u201CThis is My beloved Son, with whom I am well pleased.\u201D \u2014 Matthew 3:17"}</Scripture>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>
                Before miracles. Before public affirmation. Before visible fruit. The Father declared identity. Sonship preceded service. Approval preceded assignment.
              </p>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>
                Many leaders perform for approval. Few lead from approval.
              </p>
              <Scripture>{"\u201CAbide in Me, and I in you\u2026 apart from Me you can do nothing.\u201D \u2014 John 15:4\u20135"}</Scripture>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>
                But biblical sonship is not sentimental. It includes intimacy <em>and</em> instruction. Love <em>and</em> refinement. True sons are formed, not flattered.
              </p>
              <Scripture>{"\u201CFor the Lord disciplines the one He loves, and chastises every son whom He receives.\u201D \u2014 Hebrews 12:6"}</Scripture>
            </div>

            {/* ── ORPHAN VS. SON ── */}
            <div>
              <SectionHead sub="This is not your Sunday morning self. This is your Tuesday afternoon self \u2014 under pressure, behind closed doors, when no one is watching.">
                Two Ways to Lead: Orphan vs. Son
              </SectionHead>
              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#f9fafb", color: "#888", width: "30%" }}>Dimension</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#FEE2E2", color: RED }}>Orphan Posture</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff" }}>Son Posture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORPHAN_SON.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-sm" style={{ color: NAVY }}>{row.dimension}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: "#7F1D1D" }}>{row.orphan}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: ACCENT }}>{row.son}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Reflect id="orphan_son_reflect" prompt="Look at the Orphan column. Circle the three lines that describe your default under pressure. Not your aspiration \u2014 your default. What does this pattern reveal?" />
            </div>

            {/* ── MACRO & MICRO ── */}
            <div>
              <SectionHead sub="Just as Calling has macro (ecosystem) and micro (assignment), Connection operates on two levels. Confusing these is where leaders get deeply hurt.">
                Connection: Macro & Micro
              </SectionHead>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border-2" style={{ borderColor: ACCENT, background: ACCENT_LIGHT }}>
                  <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: ACCENT }}>Macro \u2014 Identity in God</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#333" }}>
                    Permanent. Unchanging. Not contingent on any person, role, or season. This is the Father\u2019s declaration over you. It does not shift when relationships end, leaders fail you, or communities fracture.
                  </p>
                </div>
                <div className="p-5 rounded-xl border-2" style={{ borderColor: GOLD_D, background: CREAM }}>
                  <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: GOLD_D }}>Micro \u2014 Relational Assignment</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#333" }}>
                    Seasonal. Specific. God assigns people to your life for specific purposes and timeframes. When a relational assignment ends, your identity must not end with it. The assignment changes. The identity remains.
                  </p>
                </div>
              </div>
              <Reflect id="macro_micro_reflect" prompt="Have you ever confused a relational assignment with your identity? What happened when that relationship or season ended?" />
            </div>

            {/* ── 5 GOVERNING PRINCIPLES ── */}
            <div>
              <SectionHead>Governing Principles</SectionHead>
              <div className="space-y-3">
                {PRINCIPLES.map(p => (
                  <div key={p.num} className="rounded-xl overflow-hidden border" style={{ borderColor: expandedPrinciple === p.num ? ACCENT : "#e5e5e5" }}>
                    <button
                      onClick={() => setExpandedPrinciple(expandedPrinciple === p.num ? null : p.num)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                      style={{ background: expandedPrinciple === p.num ? ACCENT_LIGHT : "#fff" }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: ACCENT }}>
                          {p.num}
                        </span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: NAVY }}>{p.title}</p>
                          <p className="text-xs" style={{ color: "#999" }}>{p.ref}</p>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${expandedPrinciple === p.num ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="#999">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedPrinciple === p.num && (
                      <div className="px-5 pb-5 border-t" style={{ borderColor: "#eee" }}>
                        <Scripture>{p.scripture}</Scripture>
                        {p.paragraphs.map((para, i) => (
                          <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{para}</p>
                        ))}
                        <Reflect id={`principle_${p.num}`} prompt={p.prompt} />
                        {p.prompt2 && <Reflect id={`principle_${p.num}_b`} prompt={p.prompt2} />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );


      // ─── EXEMPLAR ─────────────────────────────────────────
      case "exemplar":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>Leadership Exemplar</p>
              <h3 className="text-2xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>
                {EXEMPLAR.name} \u2014 {EXEMPLAR.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: "#999" }}>{EXEMPLAR.refs}</p>
            </div>

            <p className="leading-relaxed" style={{ color: "#333" }}>{EXEMPLAR.intro}</p>
            <Scripture>{EXEMPLAR.mainScripture}</Scripture>

            {EXEMPLAR.bodyParagraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-sm" style={{ color: "#333" }}>{p}</p>
            ))}

            {/* Arc Timeline */}
            <div className="relative pl-8 border-l-2 space-y-6 my-6" style={{ borderColor: ACCENT_MID }}>
              {EXEMPLAR.arc.map((a, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 rounded-full border-2" style={{ background: i === 0 ? ACCENT : "#fff", borderColor: ACCENT, top: "4px" }} />
                  <p className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: ACCENT }}>{a.stage}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{a.text}</p>
                </div>
              ))}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "#333" }}>He said:</p>
            <Scripture>{EXEMPLAR.closingScripture}</Scripture>
            <p className="text-sm leading-relaxed font-medium" style={{ color: NAVY }}>{EXEMPLAR.closingLine}</p>

            {/* Coaching Questions */}
            <div className="mt-8 p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: GOLD_D }}>COACHING QUESTIONS</p>
              {EXEMPLAR.coachingQuestions.map((q, i) => (
                <Reflect key={i} id={`exemplar_q_${i}`} prompt={q} />
              ))}
            </div>
          </div>
        );


      // ─── STAGES ───────────────────────────────────────────
      case "stages":
        return (
          <div className="space-y-6">
            <SectionHead sub="These are not stages you graduate from. They are depths you grow into. Most leaders cycle through them multiple times \u2014 each pass goes deeper.">
              How Connection Develops: Three Stages
            </SectionHead>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {STAGES.map((s, i) => (
                      <th key={i} className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff", width: "33.3%" }}>
                        Stage {i + 1}: {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {STAGES.map((s, i) => (
                      <td key={i} className="px-4 py-4 align-top text-sm leading-relaxed" style={{ color: "#333" }}>
                        {s.description}
                        <p className="text-xs italic mt-2" style={{ color: "#888" }}>{s.ref}</p>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transition Marker */}
            <div className="text-center py-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: ACCENT }}>Transition Marker</p>
              <p className="text-base italic" style={{ color: "#555" }}>You no longer interpret correction as rejection.</p>
              <p className="text-base font-bold italic mt-1" style={{ color: NAVY }}>You recognize it as formation.</p>
            </div>

            <Reflect id="stages_reflect" prompt="Which stage are you in right now? What evidence supports your answer?" />
          </div>
        );


      // ─── POST-DIAGNOSTIC ──────────────────────────────────
      case "post-diagnostic":
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="font-semibold mb-1" style={{ color: NAVY }}>Connection Diagnostic \u2014 Post-Assessment</p>
              <p className="text-sm" style={{ color: "#666" }}>Now that you\u2019ve walked through the teaching, rate yourself again. Be honest about what shifted \u2014 and what didn\u2019t.</p>
            </div>
            {renderDiagnostic("post", postScores)}

            {/* Pre vs Post Comparison */}
            {totalScore(preScores) > 0 && totalScore(postScores) > 0 && (
              <div className="mt-6 p-5 rounded-xl border-2" style={{ borderColor: ACCENT }}>
                <p className="font-bold mb-3" style={{ color: NAVY }}>Your Shift</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#999" }}>{totalScore(preScores)}</p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: "#999" }}>Before</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: totalScore(postScores) - totalScore(preScores) > 0 ? ACCENT : RED }}>
                      {totalScore(postScores) - totalScore(preScores) > 0 ? "+" : ""}{totalScore(postScores) - totalScore(preScores)}
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>Shift</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: NAVY }}>{totalScore(postScores)}</p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: NAVY }}>After</p>
                  </div>
                </div>
              </div>
            )}

            <Reflect id="post_diag_reflection" prompt="What did this diagnostic reveal? Where did you score lowest \u2014 and what does that tell you?" />

            {/* Key Scriptures */}
            <div className="mt-8">
              <SectionHead sub="These are your anchor texts. Return to them when insecurity rises, when performance tempts you, when belonging feels distant.">
                Key Scriptures on Connection
              </SectionHead>
              <div className="space-y-2">
                {KEY_SCRIPTURES.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <span className="font-bold text-sm shrink-0" style={{ color: NAVY, minWidth: "140px" }}>{s.ref}</span>
                    <span className="text-sm italic" style={{ color: "#555" }}>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );


      // ─── COMMITMENT ───────────────────────────────────────
      case "commitment":
        return (
          <div className="space-y-6">
            <SectionHead sub="Connection must move from theology to practice. This is where identity becomes operational.">
              My Connection Commitment
            </SectionHead>

            <div className="space-y-5">
              {COMMITMENT_PROMPTS.map(c => (
                <div key={c.id}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label>
                  <textarea
                    className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#ddd", minHeight: "90px" }}
                    placeholder={c.placeholder}
                    value={commitments[c.id] || ""}
                    onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            {/* Connection Is a Living Rhythm */}
            <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
              <h4 className="font-bold mb-3" style={{ color: NAVY }}>Connection Is a Living Rhythm</h4>
              <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>
                What you wrote in this workbook is not a one-time exercise. It is the beginning of a rhythm that must be sustained for the rest of your leadership.
              </p>
              <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>
                Sonship awareness fades in busyness. The demands of leadership \u2014 the decisions, the crises, the opportunities, the criticism \u2014 can slowly pull you out of rest and back into striving. It happens subtly. And it happens to everyone.
              </p>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "#333" }}>
                This is why connection must be revisited. Not because your identity changes \u2014 but because your awareness of it drifts. The macro identity never changes. But your awareness of it needs constant renewal. The leader who stays connected stays grounded. The leader who drifts from connection drifts from everything.
              </p>
              <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Revisit your connection:</p>
              <div className="space-y-2 ml-1">
                {REVISIT_TRIGGERS.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Moment */}
            <div className="mt-8">
              <SectionHead sub="Translate identity into leadership behavior.">Application Moment</SectionHead>
              {APPLICATION_QUESTIONS.map((q, i) => (
                <Reflect key={i} id={`application_${i}`} prompt={q} />
              ))}
            </div>
          </div>
        );


      // ─── ADDENDUM ─────────────────────────────────────────
      case "addendum":
        return (
          <div className="space-y-10">
            <div className="p-4 rounded-xl" style={{ background: CREAM }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: GOLD_D }}>ADDENDUM</p>
              <p className="text-sm" style={{ color: "#555" }}>Additional principles on connection \u2014 the relational architecture of leadership.</p>
            </div>

            {/* ── WORK THE NET ── */}
            <div>
              <SectionHead>{WORK_THE_NET.title}</SectionHead>
              <Scripture>{WORK_THE_NET.scriptures[0].text} \u2014 {WORK_THE_NET.scriptures[0].ref}</Scripture>
              {WORK_THE_NET.paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{p}</p>
              ))}
              <Scripture>{WORK_THE_NET.scriptures[1].text} \u2014 {WORK_THE_NET.scriptures[1].ref}</Scripture>
              {WORK_THE_NET.paragraphs.slice(2, 3).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{p}</p>
              ))}
              <p className="text-sm leading-relaxed mb-3 font-semibold" style={{ color: NAVY }}>
                {WORK_THE_NET.paragraphs[3]}
              </p>
              <Scripture>{WORK_THE_NET.scriptures[2].text} \u2014 {WORK_THE_NET.scriptures[2].ref}</Scripture>
              <Reflect id="work_the_net" prompt={WORK_THE_NET.prompt} />
            </div>

            {/* Divider */}
            <div className="border-t-2 pt-8" style={{ borderColor: GOLD_D }} />

            {/* ── RELATIONAL ORBITS ── */}
            <div>
              <SectionHead>{RELATIONAL_ORBITS.title}</SectionHead>
              <Scripture>{RELATIONAL_ORBITS.scriptures[0].text} \u2014 {RELATIONAL_ORBITS.scriptures[0].ref}</Scripture>
              {RELATIONAL_ORBITS.paragraphs.slice(0, 2).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{p}</p>
              ))}
              <Scripture>{RELATIONAL_ORBITS.scriptures[1].text} \u2014 {RELATIONAL_ORBITS.scriptures[1].ref}</Scripture>
              {RELATIONAL_ORBITS.paragraphs.slice(2).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{p}</p>
              ))}
              <Reflect id="orbits_1" prompt={RELATIONAL_ORBITS.prompt} />
              <Reflect id="orbits_2" prompt={RELATIONAL_ORBITS.prompt2} />
            </div>

            {/* Closing Quote */}
            <div className="text-center py-6">
              <p className="text-lg italic font-bold" style={{ color: NAVY }}>
                \u201CIdentity removes the need to impress.\u201D
              </p>
            </div>

            {/* Next Module Teaser */}
            <div className="p-5 rounded-xl text-center" style={{ background: NAVY }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD }}>NEXT MODULE</p>
              <p className="text-lg font-bold" style={{ color: "#fff" }}>COMPETENCY</p>
              <p className="text-sm" style={{ color: ACCENT_MID }}>Excellence (Credibility)</p>
            </div>
          </div>
        );


      // ─── AI SUMMARY ───────────────────────────────────────
      case "summary":
        return (
          <div className="space-y-6">
            <SectionHead sub="Based on your diagnostics, reflections, and commitments \u2014 here is your personalized Connection analysis.">
              Your Connection Blueprint
            </SectionHead>

            {!aiSummary && !loading && (
              <button
                onClick={generateSummary}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${NAVY})` }}
              >
                Generate My Connection Blueprint
              </button>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} />
                <p className="text-sm" style={{ color: "#888" }}>Generating your personalized blueprint...</p>
              </div>
            )}

            {aiSummary && (
              <div className="p-6 rounded-2xl border" style={{ borderColor: ACCENT }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}>
                    <span className="text-white text-sm">\u2726</span>
                  </div>
                  <p className="font-bold" style={{ color: NAVY }}>Your Connection Blueprint</p>
                </div>
                <div className="prose prose-sm max-w-none" style={{ color: "#333" }}>
                  {aiSummary.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };


  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => nav?.("dashboard")} className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>
            \u2190 Dashboard
          </button>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Module 2</p>
            <p className="text-sm font-bold" style={{ color: NAVY }}>Connection</p>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent",
                color: i === step ? "#fff" : i < step ? ACCENT : "#aaa",
                border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}`,
              }}
            >
              {i < step && <span>\u2713</span>}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{currentStep.label}</p>
          <h2 className="text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>
            Connection: Identity (Relationships)
          </h2>
          <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Whose am I?</p>
        </div>
        {renderStep()}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3">
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ color: NAVY, border: `1px solid ${NAVY}` }}
          >
            \u2190 Previous
          </button>
          <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
          <button
            onClick={() => step < STEPS.length - 1 && setStep(step + 1)}
            disabled={step === STEPS.length - 1}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30"
            style={{ background: ACCENT }}
          >
            Next \u2192
          </button>
        </div>
      </div>
    </div>
  );
}
