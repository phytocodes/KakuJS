import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { KakuPlugin } from '../core/types';

gsap.registerPlugin(ScrollTrigger);

const invert: KakuPlugin = {
	phase: 'init',

	init() {
		const invertTarget = document.querySelector('.js-invert') as HTMLElement | null;
		if (!invertTarget) return;

		const toggleElements = gsap.utils.toArray<HTMLElement>('.js-invert-toggle');
		const invertCenter = invertTarget.offsetHeight / 2;

		toggleElements.forEach((el) => {
			gsap.context(() => {
				ScrollTrigger.create({
					trigger: el,
					start: `top ${invertCenter}`,
					end: `bottom ${invertCenter}`,
					toggleClass: {
						targets: invertTarget,
						className: 'is-invert',
					},
				});
			}, el);
		});
	},
};

export default invert;
