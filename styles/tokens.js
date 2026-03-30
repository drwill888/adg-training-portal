// styles/tokens.js
// Single source of truth for the 5C Leadership Blueprint design system.
// Import from here — never hardcode hex values in pages or components.

// ─── PALETTE ───────────────────────────────────────────────
export const colors = {
  // Primary
  navy: "#021A35",
  navyLight: "#0a2d52",
  navyMid: "#132f50",
  gold: "#FDD20D",
  goldMuted: "#C8A951",
  cream: "#FDF8F0",

  // Secondary
  skyBlue: "#00AEEF",
  royalBlue: "#0172BC",
  orange: "#F47722",
  red: "#EE3124",

  // Neutrals
  white: "#FFFFFF",
  gray100: "#f9fafb",
  gray200: "#e2e6ed",
  gray300: "#c8cdd6",
  gray500: "#6b7280",

  // Semantic
  success: "#16a34a",
  error: "#dc2626",
  errorDark: "#991b1b",
  warning: "#b45309",

  // Transparent variants
  goldDim: "rgba(253,210,13,0.12)",
  goldLine: "rgba(253,210,13,0.35)",
  goldFaint: "rgba(253,210,13,0.05)",
  creamTranslucent: "rgba(253,248,240,0.55)",
  creamText: "rgba(253,248,240,0.78)",
  navyOverlay: "rgba(2,26,53,0.85)",
};

// ─── MODULE ACCENT COLORS ──────────────────────────────────
export const moduleAccents = [
  colors.gold,       // 0: Introduction
  colors.skyBlue,    // 1: Calling
  colors.royalBlue,  // 2: Connection
  colors.orange,     // 3: Competency
  colors.skyBlue,    // 4: Capacity
  colors.red,        // 5: Convergence
  colors.gold,       // 6: Commissioning
];

// ─── TYPOGRAPHY ────────────────────────────────────────────
export const fonts = {
  heading: "'Cormorant Garamond', serif",
  body: "'Outfit', sans-serif",
};

// Google Fonts URL — load this once in _document.js
export const googleFontsUrl =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap";

// ─── SPACING ───────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── BORDER RADIUS ─────────────────────────────────────────
export const radii = {
  sm: 4,    // progress bars, tags, small elements
  md: 8,    // buttons, inputs
  lg: 12,   // cards, panels
  xl: 16,   // modals
  full: 9999, // pills
};

// ─── SHADOWS ───────────────────────────────────────────────
export const shadows = {
  card: "0 2px 12px rgba(0,0,0,0.08)",
  cardHover: "0 4px 16px rgba(0,0,0,0.08)",
  modal: "0 24px 64px rgba(0,0,0,0.3)",
};
