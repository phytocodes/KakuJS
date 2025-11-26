import gsap from 'gsap';
import { mqDown } from '../utils';

// dataset の型を拡張しておく
interface CursorContainerDataset extends DOMStringMap {
	src?: string;
	cursorText?: string;
}

export default function cursorFollow(): void {
	const ball = document.querySelector<HTMLElement>('.mouse');
	if (!ball || mqDown('sm')) return;

	const pointer = document.querySelector<HTMLElement>('.mouse__pointer');
	if (!pointer) return;

	const containers = document.querySelectorAll<HTMLElement>('.js-hover-cursor');

	const pos = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};

	const mouse = { ...pos };
	const speed = 0.2;

	// setter の型補正
	const xSet = gsap.quickSetter(ball, 'x', 'px') as (v: number) => void;
	const ySet = gsap.quickSetter(ball, 'y', 'px') as (v: number) => void;

	gsap.set('.mouse', { xPercent: -70, yPercent: -70 });

	// --- mouse move ---
	window.addEventListener('mousemove', (e: MouseEvent) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});

	// --- render loop ---
	gsap.ticker.add(() => {
		// adjust speed for higher refresh monitors
		const dt = 1.0 - (1.0 - speed) ** gsap.ticker.deltaRatio();
		pos.x += (mouse.x - pos.x) * dt;
		pos.y += (mouse.y - pos.y) * dt;

		xSet(pos.x);
		ySet(pos.y);
	});

	// --- hover containers ---
	containers.forEach((container) => {
		const ds = container.dataset as CursorContainerDataset;

		container.addEventListener('mouseenter', () => {
			if (ds.src) pointer.dataset.bg = ds.src;
			if (ds.cursorText) pointer.dataset.text = ds.cursorText;

			ball.classList.add('is-hover');
		});

		container.addEventListener('mouseleave', () => {
			ball.classList.remove('is-hover');
			pointer.dataset.bg = '';
			pointer.dataset.text = '';
		});
	});
}
