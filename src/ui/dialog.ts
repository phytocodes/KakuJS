interface DialogWithLastFocus extends HTMLDialogElement {
	_lastFocus?: HTMLElement | null;
}

export default function dialog(): void {
	const dialogs = document.querySelectorAll<DialogWithLastFocus>('dialog.dialog');
	const openButtons = document.querySelectorAll<HTMLButtonElement>('.js-dialog-open');

	if (dialogs.length === 0) return;

	// --- ID => dialog キャッシュ ---
	const dialogMap = new Map<string, DialogWithLastFocus>();
	dialogs.forEach((d) => {
		dialogMap.set(d.id, d)
	});

	const isHashControlEnabled = (dialog: DialogWithLastFocus) => dialog.dataset.hashControl === 'true';

	// --- 閉じるアニメーション ---
	const closeDialogAnimated = (dialog: DialogWithLastFocus) => {
		if (!dialog.open || dialog.classList.contains('is-closing')) return;

		// ハッシュ制御リセット
		if (isHashControlEnabled(dialog) && window.location.hash === `#${dialog.id}`) {
			history.replaceState('', document.title, window.location.pathname + window.location.search);
		}

		dialog.classList.remove('is-open');
		dialog.classList.add('is-closing');

		const onTransitionEnd = (e: TransitionEvent) => {
			if (e.target !== dialog || e.propertyName !== 'opacity') return;
			dialog.removeEventListener('transitionend', onTransitionEnd);
			dialog.classList.remove('is-closing');
			dialog.close();
		};

		dialog.addEventListener('transitionend', onTransitionEnd);

		// フォールバック
		const duration = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000 || 400;
		setTimeout(() => {
			if (dialog.open) {
				dialog.removeEventListener('transitionend', onTransitionEnd);
				dialog.classList.remove('is-closing');
				dialog.close();
			}
		}, duration + 50);
	};

	// --- 開くボタン設定 ---
	openButtons.forEach((button) => {
		button.setAttribute('aria-expanded', 'false');
		button.setAttribute('aria-haspopup', 'dialog');

		button.addEventListener('click', (e: MouseEvent) => {
			e.preventDefault();
			const targetId = button.dataset.dialogTarget;
			if (!targetId) return;

			const targetDialog = dialogMap.get(targetId);
			if (!targetDialog) return;

			targetDialog._lastFocus = button;

			targetDialog.classList.remove('is-closing');
			if (!targetDialog.open) targetDialog.showModal();

			requestAnimationFrame(() => targetDialog.classList.add('is-open'));
			button.setAttribute('aria-expanded', 'true');

			document.body.style.overflow = 'hidden';

			const container = targetDialog.querySelector<HTMLElement>('.dialog__overlay');
			if (container) container.scrollTop = 0;

			if (isHashControlEnabled(targetDialog)) {
				window.location.hash = targetId;
			}
		});
	});

	// --- ダイアログ閉じる処理 ---
	dialogs.forEach((dialog) => {
		const inner = dialog.querySelector<HTMLElement>('.dialog__inner');

		dialog.querySelectorAll<HTMLButtonElement>('.js-dialog-close').forEach((button) => {
			button.addEventListener('click', () => closeDialogAnimated(dialog));
		});

		dialog.addEventListener('click', (e: MouseEvent) => {
			if (inner && !inner.contains(e.target as Node)) closeDialogAnimated(dialog);
		});

		dialog.addEventListener('cancel', (e: Event) => {
			e.preventDefault();
			closeDialogAnimated(dialog);
		});

		dialog.addEventListener('close', () => {
			document.body.style.overflow = '';

			const opener = dialog._lastFocus;
			if (opener) setTimeout(() => opener.focus(), 0);
			if (opener) opener.setAttribute('aria-expanded', 'false');

			dialog._lastFocus = null;
		});
	});

	// --- ハッシュ制御 ---
	const shouldEnableHashControl = Array.from(dialogs).some(isHashControlEnabled);

	if (shouldEnableHashControl) {
		const handleHashChange = () => {
			const hash = window.location.hash.substring(1);

			dialogs.forEach((dialog) => {
				if (!isHashControlEnabled(dialog)) return;

				const opener = document.querySelector<HTMLButtonElement>(`.js-dialog-open[data-dialog-target="${dialog.id}"]`);

				if (dialog.id === hash) {
					if (!dialog.open) dialog.showModal();
					requestAnimationFrame(() => dialog.classList.add('is-open'));
					if (opener) opener.setAttribute('aria-expanded', 'true');

					dialog._lastFocus = null;

					const container = dialog.querySelector<HTMLElement>('.dialog__overlay');
					if (container) container.scrollTop = 0;

					document.body.style.overflow = 'hidden';
				} else if (dialog.open && dialog.id !== hash) {
					if (opener) opener.setAttribute('aria-expanded', 'false');
					closeDialogAnimated(dialog);
				}
			});
		};

		window.addEventListener('load', handleHashChange);
		window.addEventListener('hashchange', handleHashChange);
	}
}
