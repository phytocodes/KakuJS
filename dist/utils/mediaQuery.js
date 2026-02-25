const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"].reduce(
  (acc, key) => {
    acc[key] = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${key}`).trim().replace("px", ""),
      10
    );
    return acc;
  },
  {}
);
const mqUp = (bp1, bp2 = null) => {
  const bp1_val = breakpoints[bp1];
  if (!bp2) {
    return window.matchMedia(`(min-width: ${bp1_val}px)`).matches;
  }
  const bp2_val_max = breakpoints[bp2] - 1;
  return window.matchMedia(`(min-width: ${bp1_val}px) and (max-width: ${bp2_val_max}px)`).matches;
};
const mqDown = (bp1, bp2 = null) => {
  const bp1_val_max = breakpoints[bp1] - 1;
  if (!bp2) {
    return window.matchMedia(`(max-width: ${bp1_val_max}px)`).matches;
  }
  const bp2_val = breakpoints[bp2];
  return window.matchMedia(`(max-width: ${bp1_val_max}px) and (min-width: ${bp2_val}px)`).matches;
};
export {
  breakpoints,
  mqDown,
  mqUp
};
