import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function invert(): void {
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
}
