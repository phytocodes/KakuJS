import { mqUp } from '../utils';
import Lenis from 'lenis'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function smoothScroll() {

	const DEFAULT_PC_OFFSET = -69;
  const DEFAULT_SP_OFFSET = -50;

	const htmlElement = document.documentElement;

	const lenis = new Lenis({
		smooth: true,
	});

	lenis.on('scroll', ScrollTrigger.update);

	function raf(time) {
		lenis.raf(time);
		ScrollTrigger.update();
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]:not(.no-lenis-scroll)');

	smoothScrollTrigger.forEach(target => {
		target.addEventListener('click', (e) => {

			const pcOffsetData = target.dataset.pcOffset;
			const spOffsetData = target.dataset.spOffset;
			const offset = mqUp('sm')
				? (pcOffsetData ? Number(pcOffsetData) : DEFAULT_PC_OFFSET)
				: (spOffsetData ? Number(spOffsetData) : DEFAULT_SP_OFFSET);

			e.preventDefault();
			htmlElement.classList.add('smooth');
			const href = target.getAttribute('href');
			lenis.scrollTo(href, {
				lock: true,
				offset: offset,
				onComplete: () => {
					htmlElement.classList.remove('smooth');
				}
			})
		});
	});

}