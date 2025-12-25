import type { KakuPlugin } from '../core/types';

export const loadState: KakuPlugin = {
	phase: 'init',
	init: () => {
		document.body.classList.add('is-loaded');
	},
};
