import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { KakuPlugin } from '../core/types';

gsap.registerPlugin(SplitText);

const splitText: KakuPlugin = {
	phase: 'setup',

	init() {
		const targets = document.querySelectorAll<HTMLElement>('.js-split-text');
		if (!targets.length) return;

		targets.forEach((target) => {
			const delayBase = parseFloat(target.dataset.delayBase || '0');

			// SplitText インスタンス生成
			const split = new SplitText(target, {
				type: 'chars',
				tag: 'span',
				charsClass: 'char-item',
			});

			target.setAttribute('role', 'text');

			if (!split.chars || !split.chars.length) return;

			// 各文字に遅延設定
			split.chars.forEach((charElement, index) => {
				if (charElement instanceof HTMLElement) {
					const delay = delayBase * index;
					charElement.style.transitionDelay = `${delay}s`;
				}
			});
		});
	},
};

export default splitText;
