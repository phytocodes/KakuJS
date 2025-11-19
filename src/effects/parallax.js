import { mqUp, mqDown } from '../utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const BREAKPOINT_KEY = 'sm';
const PC_Y_DEFAULT = '-2.0833333333vw';
const PC_OFFSET = '80px';
const SP_Y_DEFAULT = '-10%';
const SCRUB_VALUE = 2;

export default function parallax() {

	const els = gsap.utils.toArray('.js-parallax');
	const isPc = mqUp(BREAKPOINT_KEY);
	const isSp = mqDown(BREAKPOINT_KEY);
	const initialY = ( isPc ) ? PC_Y_DEFAULT : SP_Y_DEFAULT;
	const offset = ( isPc ) ? PC_OFFSET : 0;

	if ( !els ) return;

	els.forEach(el => {

		const pcY = ( el.dataset.parallaxY ) ? el.dataset.parallaxY : initialY;
		const Y =  ( el.dataset.parallaxSpY && isSp ) ? el.dataset.parallaxSpY : pcY;
		const trigger = (  el.dataset.parallaxTrigger ) ? `.${el.dataset.parallaxTrigger}` : el;

		// start位置の設定 (data-parallaxStart='top' の場合はトップから発火)
		const isStartTop = el.dataset.parallaxStart === 'top';
		const start = ( isStartTop ) ? `top ${offset}` : 'top bottom';
		const end = ( isStartTop ) ? `bottom top` : 'top top';

		gsap.to(el, {
			y: Y,
			scrollTrigger: {
				trigger: trigger,
				start: start,
				end: end,
				scrub: SCRUB_VALUE,
				// markers: true, // デバッグ用のマーカーも削除
			}
		});

	});

}