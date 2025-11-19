import { mqDown } from '../utils';
import gsap from 'gsap';

export default function cursorFollow() {

	const ball = document.querySelector(".mouse");

	if ( !ball || mqDown('sm') ) return;

	const pointer = document.querySelector(".mouse__pointer");
	const containers = document.querySelectorAll(".js-hover-cursor");
	const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	const mouse = { x: pos.x, y: pos.y };
	const speed = 0.2;
	const xSet = gsap.quickSetter(ball, "x", "px");
	const ySet = gsap.quickSetter(ball, "y", "px");

	gsap.set(".mouse", { xPercent: -70, yPercent: -70 });

	window.addEventListener("mousemove", (e) => {
		mouse.x = e.x;
		mouse.y = e.y;
	});

	gsap.ticker.add(() => {
		// adjust speed for higher refresh monitors
		const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
		pos.x += (mouse.x - pos.x) * dt;
		pos.y += (mouse.y - pos.y) * dt;
		xSet(pos.x);
		ySet(pos.y);
	});

	containers.forEach((container) => {
		container.addEventListener('mouseenter', (e) => {
			const bg = container.dataset.src;
			const text = container.dataset.cursorText

			if ( bg ) {
				pointer.dataset.bg = bg;
			}

			if ( text ) {
				pointer.dataset.text = container.dataset.cursorText;
			}

			ball.classList.add('is-hover')

		});
		container.addEventListener('mouseleave', (e) => {
			ball.classList.remove('is-hover')
			pointer.dataset.bg = '';
		});
	});

}
