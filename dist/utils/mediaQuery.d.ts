type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
declare const breakpoints: Record<BreakpointKey, number>;
declare const mqUp: (bp1: BreakpointKey, bp2?: BreakpointKey | null) => boolean;
declare const mqDown: (bp1: BreakpointKey, bp2?: BreakpointKey | null) => boolean;

export { breakpoints, mqDown, mqUp };
