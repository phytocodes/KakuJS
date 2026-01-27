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
			if (isOpen) return;

			isOpen = true;
			body.classList.add(NAV_OPEN_CLASS);

			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'true');
			});

			lastFocusedElement = document.activeElement as HTMLElement;

			// mobile 以外は inert 操作をスキップ
			if (mode === 'mobile') {
				gnav.removeAttribute('inert');
				gnav.scrollTop = 0;
				links[0]?.focus();
			}
		};

		const closeNav = () => {
			if (!isOpen) return;

			isOpen = false;
			body.classList.remove(NAV_OPEN_CLASS);

			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'false');
			});

			if (mode === 'mobile') {
				gnav.setAttribute('inert', '');
				if (lastFocusedElement) {
					lastFocusedElement.focus();
					lastFocusedElement = null;
				}
			}
		};

		/* --------------------------------
		 * hover 初回ロード制御
		 * -------------------------------- */
		const isHoveringGnav = () => {
			return window.matchMedia('(hover: hover)').matches && gnav.matches(':hover');
		};

		let hoverReady = false;
		let hoverListenerAttached = false;

		const setupHoverReady = () => {
			if (hoverReady || hoverListenerAttached) return;
			if (mode !== 'desktop') return;

			// 初期ロード時点ですでに hover している場合
			if (isHoveringGnav()) {
				body.classList.add(NAV_READY_CLASS);
				hoverReady = true;
				return;
			}

			hoverListenerAttached = true;
			gnav.addEventListener(
				'pointerenter',
				() => {
					if (mode !== 'desktop') return;
					body.classList.add(NAV_READY_CLASS);
					hoverReady = true;
				},
				{ once: true },
			);
		};

		/* --------------------------------
		 * mode 適用（副作用ここだけ）
		 * -------------------------------- */
		const applyMode = (nextMode: NavMode) => {
			if (mode === nextMode) return;
			mode = nextMode;

			if (mode === 'desktop') {
				isOpen = false;
				body.classList.remove(NAV_OPEN_CLASS);
				gnav.removeAttribute('inert');

				toggles.forEach((btn) => {
					btn.setAttribute('aria-expanded', 'false');
				});

				setupHoverReady();
			} else {
				isOpen = false;
				body.classList.remove(NAV_OPEN_CLASS);
				gnav.setAttribute('inert', '');

				body.classList.remove(NAV_READY_CLASS);
				hoverReady = false;
				hoverListenerAttached = false;
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
				if (isOpen) {
					closeNav();
				} else {
					openNav();
				}
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
