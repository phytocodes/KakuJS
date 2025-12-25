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
  const w = window.innerWidth;
  const bp1_val = breakpoints[bp1];
  if (!bp2) return w >= bp1_val;
  const bp2_val_max = breakpoints[bp2] - 1;
  return w >= bp1_val && w <= bp2_val_max;
};
const mqDown = (bp1, bp2 = null) => {
  const w = window.innerWidth;
  const bp1_val_max = breakpoints[bp1] - 1;
  if (!bp2) return w <= bp1_val_max;
  const bp2_val = breakpoints[bp2];
  return w <= bp1_val_max && w >= bp2_val;
};
export {
  breakpoints,
  mqDown,
  mqUp
};
