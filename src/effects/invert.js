import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * ページのスクロール位置に応じて、指定された要素のクラスを反転/切り替える処理
 */
export default function invert() {
	// 以前作成された関連するScrollTriggerを破棄し、重複を防ぐ (SPA対応)
	ScrollTrigger.getAll().forEach(trigger => {
		if (trigger.vars.toggleClass && trigger.vars.toggleClass.className.startsWith('is-invert')) {
			trigger.kill();
		}
	});

	const invertTarget = document.querySelector('.js-invert');
	const toggles = gsap.utils.toArray('.js-invert-toggle');

	if (!invertTarget || toggles.length === 0) {
		return;
	}

	toggles.forEach(el => {
		const elElement = el;
		// data-invert, data-start-offset, data-end-offset を取得
		const { invert: position, startOffset, endOffset } = elElement.dataset;

		// 付与するクラス名を決定
		const addClass = position ? `is-invert--${position}` : 'is-invert';

		// start/end のオフセット値を決定 (未設定の場合は '0%')
		const startOffsetValue = startOffset || '0%';
		const endOffsetValue = endOffset || '0%';

		// ScrollTrigger の設定
		const commonConfig = {
			trigger: elElement,
			// 'top center' から startOffsetValue 分オフセット
			start: `top center+=${startOffsetValue}`,
			// 'bottom center' から endOffsetValue 分オフセット
			end: `bottom center-=${endOffsetValue}`,
			toggleClass: {
				targets: invertTarget,
				className: addClass,
			},
			// markers: true,
		};

		// ScrollTriggerの作成
		gsap.to(elElement, { scrollTrigger: commonConfig });
	});

	// すべてのトリガーを作成後、一度だけリフレッシュ
	ScrollTrigger.refresh();
}