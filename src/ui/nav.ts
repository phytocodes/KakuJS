import type { KakuPlugin } from '../core/types';
import { debounce, mqDown } from '../utils';

const NAV_OPEN_CLASS = 'is-nav-opened';
const NAV_READY_CLASS = 'is-nav-ready';

const nav: KakuPlugin = {
	phase: 'init',

	init() {
		const body = document.body;
		const gnav = document.querySelector<HTMLElement>('.gnav');
		const toggles = document.querySelectorAll<HTMLButtonElement>('.js-gnav-toggle');
		const overlay = document.getElementById('overlay');
		const links = gnav ? gnav.querySelectorAll<HTMLAnchorElement>('a') : [];

		if (!gnav) return;

		let lastFocusedElement: HTMLElement | null = null;
		let isReady = false;

		/* -----------------------------
		 * 状態更新（唯一の真実）
		 * ----------------------------- */
		const setNavOpen = (open: boolean) => {
			body.classList.toggle(NAV_OPEN_CLASS, open);

			toggles.forEach((btn): void => {
				btn.setAttribute('aria-expanded', open ? 'true' : 'false');
			});

			gnav.setAttribute('aria-hidden', open ? 'false' : 'true');

			if (open) {
				gnav.scrollTop = 0;
				lastFocusedElement = document.activeElement as HTMLElement;
				links[0]?.focus();
			} else if (lastFocusedElement) {
				lastFocusedElement.focus();
				lastFocusedElement = null;
			}
		};

		/* -----------------------------
		 * 初期化（表示はしない）
		 * ----------------------------- */
		const syncByViewport = () => {
			const isMobile = mqDown('xxl');

			if (isMobile) {
				setNavOpen(false);
			} else {
				// PCでは JS は開閉しない
				gnav.setAttribute('aria-hidden', 'false');
				toggles.forEach((btn): void => {
					btn.setAttribute('aria-expanded', 'false');
				});
				body.classList.remove(NAV_OPEN_CLASS);
			}
		};

		/* -----------------------------
		 * トグル
		 * ----------------------------- */
		toggles.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				setNavOpen(!body.classList.contains(NAV_OPEN_CLASS));
			});
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') setNavOpen(false);
		});

		links.forEach((link) => {
			link.addEventListener('click', () => setNavOpen(false));
		});

		overlay?.addEventListener('click', () => setNavOpen(false));

		/* -----------------------------
		 * hover 初回ロード制御（重要）
		 * ----------------------------- */
		const navItems = document.querySelectorAll('.gnav__item-link');
		navItems.forEach((item): void => {
			item.addEventListener(
				'mouseover',
				(): void => {
					if (isReady) return;
					body.classList.add(NAV_READY_CLASS);
					isReady = true;
				},
				{ once: true },
			);
		});

		window.addEventListener('resize', debounce(syncByViewport, 200));
		window.addEventListener('load', syncByViewport);
	},
};

export default nav;
