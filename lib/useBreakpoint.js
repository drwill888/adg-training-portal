// lib/useBreakpoint.js
// Shared responsive hook — single source of truth for all breakpoint logic.
// Replaces per-page useIsMobile hooks.

import { useState, useEffect } from "react";
import { breakpoints } from "../styles/tokens";

export function useIsMobile(bp) {
  var breakpoint = bp || breakpoints.mobile;
  var initial = typeof window !== "undefined" ? window.innerWidth < breakpoint : false;
  var state = useState(initial);
  var isMobile = state[0];
  var setIsMobile = state[1];
  useEffect(function() {
    var handler = function() { setIsMobile(window.innerWidth < breakpoint); };
    window.addEventListener("resize", handler);
    return function() { window.removeEventListener("resize", handler); };
  }, [breakpoint]);
  return isMobile;
}
