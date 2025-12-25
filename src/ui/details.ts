import type { KakuPlugin } from '../core/types';

const details: KakuPlugin = {
	phase: 'init',

	init() {
		const detailsList = document.querySelectorAll<HTMLDetailsElement>('.details');
		if (!detailsList.length) return;

		const animTiming: KeyframeAnimationOptions = {
			duration: 400,
			easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
		};

		detailsList.forEach((el) => {
			const summary = el.querySelector<HTMLElement>('.details__summary');
			const content = el.querySelector<HTMLElement>('.details__content');
			if (!summary || !content) return;

			// --- Accessibility ---
			summary.setAttribute('role', 'button');
			summary.setAttribute('aria-expanded', el.hasAttribute('open') ? 'true' : 'false');

			// --- Keyboard control ---
			summary.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key === ' ' || e.key === 'Enter') {
					e.preventDefault(); // avoid scroll
				}
			});

			summary.addEventListener('keyup', (e: KeyboardEvent) => {
				if (e.key === ' ' || e.key === 'Enter') {
					toggleDetails(el, summary, content, animTiming);
				}
			});

			summary.addEventListener('click', (e) => {
				e.preventDefault();
				toggleDetails(el, summary, content, animTiming);
			});
		});
	},
};

export default details;

/**
 * details 開閉処理（アニメーション含む）
 */
function toggleDetails(
	el: HTMLDetailsElement,
	summary: HTMLElement,
	content: HTMLElement,
	animTiming: KeyframeAnimationOptions,
): void {
	const isOpen = el.hasAttribute('open');

	// --- Close ---
	if (isOpen) {
		const startHeight = content.offsetHeight;

		const animation = content.animate(
			[
				{ height: `${startHeight}px`, opacity: 1 },
				{ height: '0px', opacity: 0 },
			],
			animTiming,
		);

		animation.onfinish = () => {
			el.removeAttribute('open');
			summary.setAttribute('aria-expanded', 'false');
			content.style.height = '';
			content.style.opacity = '';
		};

		return;
	}

	// --- Open ---
	el.setAttribute('open', '');
	summary.setAttribute('aria-expanded', 'true');

	// 開く寸前で高さを取得するため rAF を使用
	requestAnimationFrame(() => {
		const fullHeight = content.scrollHeight;

		const animation = content.animate(
			[
				{ height: '0px', opacity: 0 },
				{ height: `${fullHeight}px`, opacity: 1 },
			],
			animTiming,
		);

		animation.onfinish = () => {
			content.style.height = 'auto';
			content.style.opacity = '';
		};
	});
}
