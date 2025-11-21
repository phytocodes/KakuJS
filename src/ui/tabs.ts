export default function tab(): void {
	const tabs = document.querySelectorAll<HTMLElement>('.tab');

	if (!tabs.length) return;

	tabs.forEach((tab) => {
		const buttons = tab.querySelectorAll<HTMLElement>('.tab__button');
		const panels = tab.querySelectorAll<HTMLElement>('.tab__panel');

		buttons[0]?.classList.add('is-active');
		panels[0]?.classList.add('is-active');

		buttons.forEach((button, buttonIndex) => {
			button.addEventListener('click', () => {
				buttons.forEach((btn, i) => {
					btn.classList.toggle('is-active', i === buttonIndex);
				});
				panels.forEach((panel, i) => {
					panel.classList.toggle('is-active', i === buttonIndex);
				});
			});
		});
	});
}
