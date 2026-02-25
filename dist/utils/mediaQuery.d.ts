type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
declare const breakpoints: Record<BreakpointKey, number>;
/**
 * 指定したブレイクポイント以上（または範囲内）か判定
 * mqUp('md') => (min-width: 768px)
 * mqUp('md', 'lg') => (min-width: 768px) and (max-width: 1023px)
 */
declare const mqUp: (bp1: BreakpointKey, bp2?: BreakpointKey | null) => boolean;
/**
 * 指定したブレイクポイント以下（または範囲内）か判定
 * mqDown('md') => (max-width: 767px)
 * mqDown('md', 'lg') => (max-width: 767px) and (min-width: 576px)
 */
declare const mqDown: (bp1: BreakpointKey, bp2?: BreakpointKey | null) => boolean;

export { breakpoints, mqDown, mqUp };
