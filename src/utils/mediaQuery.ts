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

/**
 * 指定したブレイクポイント以上（または範囲内）か判定
 * mqUp('md') => (min-width: 768px)
 * mqUp('md', 'lg') => (min-width: 768px) and (max-width: 1023px)
 */
export const mqUp = (bp1: BreakpointKey, bp2: BreakpointKey | null = null): boolean => {
	const bp1_val = breakpoints[bp1];

	if (!bp2) {
		return window.matchMedia(`(min-width: ${bp1_val}px)`).matches;
	}

	const bp2_val_max = breakpoints[bp2] - 1;
	return window.matchMedia(`(min-width: ${bp1_val}px) and (max-width: ${bp2_val_max}px)`).matches;
};

/**
 * 指定したブレイクポイント以下（または範囲内）か判定
 * mqDown('md') => (max-width: 767px)
 * mqDown('md', 'lg') => (max-width: 767px) and (min-width: 576px)
 */
export const mqDown = (bp1: BreakpointKey, bp2: BreakpointKey | null = null): boolean => {
	const bp1_val_max = breakpoints[bp1] - 1;

	if (!bp2) {
		return window.matchMedia(`(max-width: ${bp1_val_max}px)`).matches;
	}

	const bp2_val = breakpoints[bp2];
	return window.matchMedia(`(max-width: ${bp1_val_max}px) and (min-width: ${bp2_val}px)`).matches;
};
