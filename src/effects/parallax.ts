import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mqDown, mqUp } from '../utils';

gsap.registerPlugin(ScrollTrigger);

const BREAKPOINT_KEY = 'sm';
const PC_Y_DEFAULT = '-2.0833333333vw';
const PC_OFFSET = '80px';
const SP_Y_DEFAULT = '-10%';
const SCRUB_VALUE = 2;

// --- 各要素の dataset を型強化しておく ---
interface ParallaxDataset extends DOMStringMap {
	parallaxY?: string;
	parallaxSpY?: string;
	parallaxTrigger?: string;
	parallaxStart?: 'top' | string;
}

/**
 * パララックスエフェクト
 */
export default function parallax(): void {
	// NOTE: gsap.utils.toArray は Element | string の混在を返せるため型補正
	const els = gsap.utils.toArray<HTMLElement>('.js-parallax');
	if (!els.length) return;

	const isPc = mqUp(BREAKPOINT_KEY);
	const isSp = mqDown(BREAKPOINT_KEY);

	const initialY = isPc ? PC_Y_DEFAULT : SP_Y_DEFAULT;
	const offset = isPc ? PC_OFFSET : '0px';

	els.forEach((el) => {
		// --- dataset を型拡張して利用できるようにする ---
		const ds = el.dataset as ParallaxDataset;

		const pcY = ds.parallaxY ?? initialY;
		const Y = isSp && ds.parallaxSpY ? ds.parallaxSpY : pcY;

		const trigger = ds.parallaxTrigger ? `.${ds.parallaxTrigger}` : el;

		// start位置
		const isStartTop = ds.parallaxStart === 'top';
		const start = isStartTop ? `top ${offset}` : 'top bottom';
		const end = isStartTop ? 'bottom top' : 'top top';

		gsap.to(el, {
			y: Y,
			scrollTrigger: {
				trigger,
				start,
				end,
				scrub: SCRUB_VALUE,
			},
		});
	});
}
