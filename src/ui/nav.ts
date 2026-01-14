import type { KakuPlugin } from '../core/types';
import { debounce, mqDown } from '../utils';

const NAV_OPEN_CLASS = 'is-nav-opened';
const NAV_READY_CLASS = 'is-nav-ready';

type NavMode = 'mobile' | 'desktop';

const nav: KakuPlugin = {
	phase: 'init',

	init() {
		const body = document.body;
		const gnav = document.querySelector<HTMLElement>('.gnav');
		const toggles = document.querySelectorAll<HTMLButtonElement>('.js-gnav-toggle');
		const overlay = document.getElementById('overlay');
		const links = gnav ? gnav.querySelectorAll<HTMLAnchorElement>('a') : [];

		if (!gnav) return;

		let mode: NavMode | null = null;
		let isOpen = false;
		let lastFocusedElement: HTMLElement | null = null;

		/* --------------------------------
		 * mode 判定
		 * -------------------------------- */
		const detectMode = (): NavMode => (mqDown('xxl') ? 'mobile' : 'desktop');

		/* --------------------------------
		 * mobile open / close
		 * -------------------------------- */
		const openNav = () => {
			if (mode !== 'mobile' || isOpen) return;

			isOpen = true;
			body.classList.add(NAV_OPEN_CLASS);

			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'true');
			});

			lastFocusedElement = document.activeElement as HTMLElement;
			gnav.removeAttribute('inert');
			gnav.scrollTop = 0;
			links[0]?.focus();
		};

		const closeNav = () => {
			if (mode !== 'mobile' || !isOpen) return;

			isOpen = false;
			body.classList.remove(NAV_OPEN_CLASS);

			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'false');
			});

			gnav.setAttribute('inert', '');

			if (lastFocusedElement) {
				lastFocusedElement.focus();
				lastFocusedElement = null;
			}
		};

		/* --------------------------------
		 * mode 適用（副作用ここだけ）
		 * -------------------------------- */
		const applyMode = (nextMode: NavMode) => {
			if (mode === nextMode) return;
			mode = nextMode;

			if (mode === 'desktop') {
				// desktop は常時有効・JS開閉なし
				isOpen = false;
				body.classList.remove(NAV_OPEN_CLASS);
				gnav.removeAttribute('inert');

				toggles.forEach((btn) => {
					btn.setAttribute('aria-expanded', 'false');
				});
			} else {
				// mobile 初期状態は closed
				isOpen = false;
				body.classList.remove(NAV_OPEN_CLASS);
				gnav.setAttribute('inert', '');
			}
		};

		/* --------------------------------
		 * 初期化
		 * -------------------------------- */
		applyMode(detectMode());

		/* --------------------------------
		 * toggle
		 * -------------------------------- */
		toggles.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				if (mode !== 'mobile') return;
				isOpen ? closeNav() : openNav();
			});
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeNav();
		});

		links.forEach((link) => {
			link.addEventListener('click', closeNav);
		});

		overlay?.addEventListener('click', closeNav);

		/* --------------------------------
		 * hover 初回ロード制御
		 * -------------------------------- */
		gnav.addEventListener(
			'mouseover',
			(e) => {
				if ((e.target as HTMLElement).closest('.gnav__item-link')) {
					body.classList.add(NAV_READY_CLASS);
				}
			},
			{ once: true },
		);

		/* --------------------------------
		 * resize（mode のみ更新）
		 * -------------------------------- */
		window.addEventListener(
			'resize',
			debounce(() => {
				applyMode(detectMode());
			}, 200),
		);
	},
};

export default nav;
