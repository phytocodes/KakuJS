import { debounce, mqDown } from '../utils';

export default function gnavToggle(): void {
	const body = document.body;
	const gnav = document.querySelector<HTMLElement>('.gnav');
	const toggles = document.querySelectorAll<HTMLButtonElement>('.js-gnav-toggle');
	const overlay = document.getElementById('overlay');
	const links = gnav ? gnav.querySelectorAll<HTMLAnchorElement>('a') : [];
	const NAV_OPEN_CLASS = 'is-nav-opened';

	if (!gnav) return;

	// 初期状態を設定
	const initState = (): void => {
		const isMobile = mqDown('xxl');
		const isNavOpen = body.classList.contains(NAV_OPEN_CLASS);

		if (isMobile) {
			gnav.setAttribute('aria-hidden', isNavOpen ? 'false' : 'true');
			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', isNavOpen ? 'true' : 'false')
			});
			body.classList.remove(NAV_OPEN_CLASS);
		} else {
			gnav.setAttribute('aria-hidden', 'false');
			toggles.forEach((btn) => {
				btn.setAttribute('aria-expanded', 'false')
			});
			body.classList.remove(NAV_OPEN_CLASS);
		}
	};

	let lastFocusedElement: HTMLElement | null = null;

	// 開閉関数
	const setNavState = (isOpen: boolean): void => {
		body.classList.toggle(NAV_OPEN_CLASS, isOpen);

		toggles.forEach((btn) => {
			btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
		});

		if (isOpen) {
			gnav.setAttribute('aria-hidden', 'false');
			gnav.scrollTop = 0;

			lastFocusedElement = document.activeElement as HTMLElement;

			if (links.length > 0) {
				links[0].focus();
			}
		} else {
			gnav.setAttribute('aria-hidden', 'true');

			if (lastFocusedElement) {
				lastFocusedElement.focus();
				lastFocusedElement = null;
			}
		}
	};

	toggles.forEach((btn) => {
		btn.addEventListener('click', (e: Event) => {
			e.preventDefault();
			const isOpen = !body.classList.contains(NAV_OPEN_CLASS);
			setNavState(isOpen);
		});
	});

	document.addEventListener('keydown', (e: KeyboardEvent) => {
		if (body.classList.contains(NAV_OPEN_CLASS) && e.key === 'Escape') {
			e.preventDefault();
			setNavState(false);
		}
	});

	links.forEach((link) => {
		link.addEventListener('click', () => setNavState(false))
	});
	if (overlay) overlay.addEventListener('click', () => setNavState(false));

	window.addEventListener('resize', debounce(initState, 200));
	window.addEventListener('load', () => initState());
}
