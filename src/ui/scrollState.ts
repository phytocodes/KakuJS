export function scrollState(threshold: number = 0): void {
	let lastY = 0;
	let ticking = false;
	const body = document.body;
	let isScrolled = body.classList.contains('is-scrolled');

	if (window.scrollY > threshold) {
		body.classList.add('is-scrolled');
		isScrolled = true;
	}

	window.addEventListener(
		'scroll',
		() => {
			lastY = window.scrollY;

			if (!ticking) {
				requestAnimationFrame(() => {
					const newState = lastY > threshold;
					if (newState !== isScrolled) {
						body.classList.toggle('is-scrolled', newState);
						isScrolled = newState;
					}
					ticking = false;
				});
				ticking = true;
			}
		},
		{ passive: true }
	);
}
