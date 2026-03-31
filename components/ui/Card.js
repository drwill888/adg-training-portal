// components/ui/Card.js
// Shared card component — dark navy panels with consistent styling
// Variants: default (navy panel), accent (gold left border), highlight (gold border)

import { colors } from "../../styles/tokens";

var base = {
  background: colors.navyLight,
  borderRadius: 8,
  border: "1px solid " + colors.navyMid,
  transition: "all 0.2s",
};

var variants = {
  default: { ...base },
  accent: {
    ...base,
    borderLeft: "3px solid " + colors.gold,
  },
  highlight: {
    ...base,
    border: "1px solid rgba(253,210,13,0.25)",
  },
  interactive: {
    ...base,
    borderLeft: "3px solid " + colors.gold,
    cursor: "pointer",
  },
};

export default function Card({
  variant = "default",
  padding,
  onClick,
  children,
  style: customStyle,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}) {
  var s = {
    ...variants[variant] || variants.default,
    padding: padding || 20,
    ...(onClick && !variants[variant]?.cursor ? { cursor: "pointer" } : {}),
    ...customStyle,
  };

  return (
    <div
      onClick={onClick}
      style={s}
      className={className}
      onMouseEnter={onMouseEnter || (onClick ? function(e) { e.currentTarget.style.background = colors.navyMid; } : undefined)}
      onMouseLeave={onMouseLeave || (onClick ? function(e) { e.currentTarget.style.background = colors.navyLight; } : undefined)}
      {...props}
    >
      {children}
    </div>
  );
}
