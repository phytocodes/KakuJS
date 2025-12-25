type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export const breakpoints: Record<BreakpointKey, number> = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'].reduce(
	(acc, key) => {
		acc[key as BreakpointKey] = parseInt(
			getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${key}`).trim().replace('px', ''),
			10,
		);
		return acc;
	},
	{} as Record<BreakpointKey, number>,
);

export const mqUp = (bp1: BreakpointKey, bp2: BreakpointKey | null = null): boolean => {
	const w = window.innerWidth;
	const bp1_val = breakpoints[bp1];
	if (!bp2) return w >= bp1_val;
	const bp2_val_max = breakpoints[bp2] - 1;
	return w >= bp1_val && w <= bp2_val_max;
};

export const mqDown = (bp1: BreakpointKey, bp2: BreakpointKey | null = null): boolean => {
	const w = window.innerWidth;
	const bp1_val_max = breakpoints[bp1] - 1;
	if (!bp2) return w <= bp1_val_max;
	const bp2_val = breakpoints[bp2];
	return w <= bp1_val_max && w >= bp2_val;
};
