// components/ui/Button.js
// Shared button component — one source of truth for the entire app
// Variants: primary (gold), outline (gold border), ghost (text only)

import { colors, fonts } from "../../styles/tokens";

var base = {
  fontFamily: fonts.body,
  fontSize: 14,
  fontWeight: 700,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textDecoration: "none",
  lineHeight: 1,
};

var variants = {
  primary: {
    ...base,
    background: colors.gold,
    color: colors.navy,
    padding: "12px 32px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  outline: {
    ...base,
    background: "transparent",
    color: colors.gold,
    padding: "10px 24px",
    border: "1px solid rgba(253,210,13,0.3)",
  },
  ghost: {
    ...base,
    background: "transparent",
    color: colors.gold,
    padding: "10px 16px",
    fontWeight: 600,
  },
};

var sizes = {
  sm: { fontSize: 12, padding: "8px 16px" },
  md: {},
  lg: { fontSize: 16, padding: "14px 40px" },
  full: { width: "100%" },
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  href,
  children,
  style: customStyle,
  className,
  ...props
}) {
  var s = {
    ...variants[variant] || variants.primary,
    ...sizes[size] || {},
    ...(disabled ? { opacity: 0.5, cursor: "default" } : {}),
    ...customStyle,
  };

  if (href) {
    return (
      <a href={href} style={s} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} style={s} className={className} {...props}>
      {children}
    </button>
  );
}
