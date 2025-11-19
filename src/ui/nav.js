import { mqDown } from '../utils';

export default function gnavToggle() {

	const body = document.body;
	const gnav = document.querySelector('.gnav');
	const toggles = document.querySelectorAll('.js-gnav-toggle');
	const overlay = document.getElementById('overlay');
	const links = gnav ? gnav.querySelectorAll('a') : [];
	const NAV_OPEN_CLASS = 'is-nav-opened';

	if (!gnav) return;

	// 初期状態を設定
	const initState = () => {
		const isMobile = mqDown('xxl');
		const isNavOpen = body.classList.contains(NAV_OPEN_CLASS);

		// モバイルビューの場合
		if (isMobile) {
			gnav.setAttribute('aria-hidden', isNavOpen ? 'false' : 'true');
			toggles.forEach((btn) => {
				// 初期状態を必ず 'false' に設定
				btn.setAttribute('aria-expanded', isNavOpen ? 'true' : 'false');
			});
			body.classList.remove(NAV_OPEN_CLASS);
		} else {
			// デスクトップビューの場合
			gnav.setAttribute('aria-hidden', 'false'); // 常に表示
			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'false');
			});
			body.classList.remove(NAV_OPEN_CLASS);
		}
	};

	let lastFocusedElement = null;

	// 開閉関数
	const setNavState = (isOpen) => {
		body.classList.toggle(NAV_OPEN_CLASS, isOpen);

		toggles.forEach((btn) => {
			btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		});

		if (isOpen) {
			gnav.setAttribute('aria-hidden', 'false');
			gnav.scrollTop = 0;

			// フォーカスを記憶
			lastFocusedElement = document.activeElement;

			// 最初のリンクにフォーカスを移動
			if (links.length > 0) {
				links[0].focus();
			}

		} else {
			gnav.setAttribute('aria-hidden', 'true');

			// 閉じた後、フォーカスを元の要素に戻す
			if (lastFocusedElement) {
				lastFocusedElement.focus();
				lastFocusedElement = null; // リセット
			}
		}
	};

	// トグルボタン
	toggles.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const isOpen = !body.classList.contains(NAV_OPEN_CLASS);
			setNavState(isOpen);
		});
	});

	 // Escapeキーでナビゲーションを閉じる
	document.addEventListener('keydown', (e) => {
		if (body.classList.contains(NAV_OPEN_CLASS) && e.key === 'Escape') {
			e.preventDefault();
			setNavState(false);
		}
	});

	// リンククリックで閉じる
	links.forEach((link) => link.addEventListener('click', () => setNavState(false)));

	// オーバーレイクリックで閉じる
	if (overlay) overlay.addEventListener('click', () => setNavState(false));

	// ウィンドウリサイズ時に表示状態を再同期
	window.addEventListener('resize', debounce(initState, 200));

	window.addEventListener('load', () => {
		initState();
	});

}