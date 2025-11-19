import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * ページのスクロール位置に応じて、指定された要素のクラスを反転/切り替える処理
 */
export default function invert() {
	const invertTarget = document.querySelector('.js-invert');
	if (!invertTarget) return;

	const toggleElements = gsap.utils.toArray('.js-invert-toggle');
	const invertCenter = invertTarget.offsetHeight / 2;

	toggleElements.forEach(el => {
		gsap.context(() => {
			ScrollTrigger.create({
				trigger: el,
				start: `top ${invertCenter}`,
				end: `bottom ${invertCenter}`,
				toggleClass: {
					targets: invertTarget,
					className: 'is-invert'
				},
			});
		}, el);
	});
}