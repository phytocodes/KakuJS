export default function details() {

	const detailsList = document.querySelectorAll('.details');
	const animTiming = { duration: 400, easing: 'ease-out' };

	detailsList.forEach((el) => {
		const summary = el.querySelector('.details__summary');
		const content = el.querySelector('.details__content');
		if (!summary || !content) return;

		// アクセシビリティ対応
		summary.setAttribute('role', 'button');
		summary.setAttribute('aria-expanded', el.hasAttribute('open') ? 'true' : 'false');
		// summary.setAttribute('tabindex', '0');

		// キーボード操作対応
		summary.addEventListener('keydown', (e) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault(); // スクロール防止
			}
		});

		summary.addEventListener('keyup', (e) => {
			if (e.key === ' ' || e.key === 'Enter') {
				toggleDetails(el, summary, content);
			}
		});

		summary.addEventListener('click', (e) => {
			e.preventDefault();
			toggleDetails(el, summary, content);
		});

	});

	// 詳細開閉関数
	function toggleDetails(el, summary, content) {
		const isOpen = el.hasAttribute('open');

		if (isOpen) {
			const startHeight = content.offsetHeight;

			// 閉じるアニメーション
			const animation = content.animate(
				[
					{ height: `${startHeight}px`, opacity: 1 },
					{ height: '0px', opacity: 0 }
				],
				animTiming
			);

			animation.onfinish = () => {
				el.removeAttribute('open');
				summary.setAttribute('aria-expanded', 'false');
				content.style.height = '';
				content.style.opacity = '';
			};

		} else {
			// 開く前に open 属性を設定
			el.setAttribute('open', '');
			summary.setAttribute('aria-expanded', 'true');

			requestAnimationFrame(() => {
				const fullHeight = content.scrollHeight;

				const animation = content.animate(
					[
						{ height: '0px', opacity: 0 },
						{ height: `${fullHeight}px`, opacity: 1 }
					],
					animTiming
				);

				animation.onfinish = () => {
					content.style.height = 'auto';
					content.style.opacity = '';
				};
			});
		}
	}

}