import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis, { type LenisOptions } from 'lenis';
import type { KakuPlugin } from '../core/types';
import { mqUp } from '../utils';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollLinkDataset extends DOMStringMap {
	pcOffset?: string;
	spOffset?: string;
}

const smoothScroll: KakuPlugin = {
	phase: 'init',

	init() {
		const DEFAULT_PC_OFFSET = -69;
		const DEFAULT_SP_OFFSET = -50;

		const htmlElement = document.documentElement;

		const lenis = new Lenis({
			smooth: true,
		} as LenisOptions);

		// ScrollTrigger と Lenis を同期
		lenis.on('scroll', ScrollTrigger.update);

		const raf = (time: number) => {
			lenis.raf(time);
			ScrollTrigger.update();
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

		const smoothScrollTriggers = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not(.no-lenis-scroll)');

		if (!smoothScrollTriggers.length) return;

		smoothScrollTriggers.forEach((target) => {
			const ds = target.dataset as SmoothScrollLinkDataset;

			target.addEventListener('click', (e: MouseEvent) => {
				e.preventDefault();

				const pcOffset = ds.pcOffset ? Number(ds.pcOffset) : DEFAULT_PC_OFFSET;
				const spOffset = ds.spOffset ? Number(ds.spOffset) : DEFAULT_SP_OFFSET;

				const offset = mqUp('sm') ? pcOffset : spOffset;

				const href = target.getAttribute('href');
				if (!href) return;

				htmlElement.classList.add('smooth');

				lenis.scrollTo(href, {
					lock: true,
					offset,
					onComplete: () => {
						htmlElement.classList.remove('smooth');
					},
				});
			});
		});
	},
};

export default smoothScroll;
