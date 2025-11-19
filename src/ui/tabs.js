export default function tab() {

	const tabs = document.querySelectorAll('.tab');

	if (!tabs.length) return;

	tabs.forEach((tab)=>{

		const buttons = tab.querySelectorAll('.tab__button');
		const panels = tab.querySelectorAll('.tab__panel');

		buttons[0].classList.add('is-active');
		panels[0].classList.add('is-active');

		buttons.forEach((button, buttonIndex) => {
			button.addEventListener('click', () => {

				buttons.forEach((button, i) => {
					if ( buttonIndex === i ) {
						button.classList.add('is-active');
					} else {
						button.classList.remove('is-active');
					}
				});

				panels.forEach((panel, i) => {
					if ( buttonIndex === i ) {
						panel.classList.add('is-active');
					} else {
						panel.classList.remove('is-active');
					}
				});

			});
		});

	});

}