import type { KakuPlugin } from '../core/types';

interface DialogWithLastFocus extends HTMLDialogElement {
	_lastFocus?: HTMLElement | null;
}

const dialog: KakuPlugin = {
	phase: 'init',

	init() {
		const dialogs = document.querySelectorAll<DialogWithLastFocus>('dialog.dialog');
		const openButtons = document.querySelectorAll<HTMLButtonElement>('.js-dialog-open');

		if (dialogs.length === 0) return;

		/* --------------------------------
		 * CustomEvent dispatcher
		 * -------------------------------- */
		const dispatchDialogEvent = (
			dialog: HTMLDialogElement,
			name: 'dialog:open' | 'dialog:close:start' | 'dialog:close:end',
		) => {
			dialog.dispatchEvent(
				new CustomEvent(name, {
					bubbles: true,
					detail: { dialog },
				}),
			);
		};

		/* --------------------------------
		 * Scroll reset helper
		 * -------------------------------- */
		const resetDialogScroll = (dialog: HTMLElement) => {
			// 明示指定があれば最優先
			const targets = dialog.querySelectorAll<HTMLElement>('[data-dialog-scroll]');

			if (targets.length > 0) {
				targets.forEach((el) => {
					el.scrollTop = 0;
				});
				return;
			}

			// フォールバック（従来挙動）
			const overlay = dialog.querySelector<HTMLElement>('.dialog__overlay');
			if (overlay) overlay.scrollTop = 0;
		};

		/* --------------------------------
		 * ID => dialog キャッシュ
		 * -------------------------------- */
		const dialogMap = new Map<string, DialogWithLastFocus>();
		dialogs.forEach((d) => {
			dialogMap.set(d.id, d);
		});

		const isHashControlEnabled = (dialog: DialogWithLastFocus) => dialog.dataset.hashControl === 'true';

		/* --------------------------------
		 * 閉じる（アニメーション付き）
		 * -------------------------------- */
		const closeDialogAnimated = (dialog: DialogWithLastFocus) => {
			if (!dialog.open || dialog.classList.contains('is-closing')) return;

			dispatchDialogEvent(dialog, 'dialog:close:start');

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

			const duration = parseFloat(getComputedStyle(dialog).transitionDuration) * 1000 || 400;

			setTimeout(() => {
				if (dialog.open) {
					dialog.removeEventListener('transitionend', onTransitionEnd);
					dialog.classList.remove('is-closing');
					dialog.close();
				}
			}, duration + 50);
		};

		/* --------------------------------
		 * 開くボタン
		 * -------------------------------- */
		openButtons.forEach((button) => {
			button.setAttribute('aria-expanded', 'false');
			button.setAttribute('aria-haspopup', 'dialog');

			button.addEventListener('click', (e) => {
				e.preventDefault();

				const targetId = button.dataset.dialogTarget;
				if (!targetId) return;

				const targetDialog = dialogMap.get(targetId);
				if (!targetDialog) return;

				targetDialog._lastFocus = button;
				targetDialog.classList.remove('is-closing');

				if (!targetDialog.open) targetDialog.showModal();

				requestAnimationFrame(() => {
					targetDialog.classList.add('is-open');
					resetDialogScroll(targetDialog);
					dispatchDialogEvent(targetDialog, 'dialog:open');
				});

				button.setAttribute('aria-expanded', 'true');
				document.body.style.overflow = 'hidden';

				if (isHashControlEnabled(targetDialog)) {
					window.location.hash = targetId;
				}
			});
		});

		/* --------------------------------
		 * dialog 閉じ処理
		 * -------------------------------- */
		dialogs.forEach((dialog) => {
			const inner = dialog.querySelector<HTMLElement>('.dialog__inner');

			dialog.querySelectorAll<HTMLButtonElement>('.js-dialog-close').forEach((button) => {
				button.addEventListener('click', () => closeDialogAnimated(dialog));
			});

			dialog.addEventListener('click', (e) => {
				if (inner && !inner.contains(e.target as Node)) {
					closeDialogAnimated(dialog);
				}
			});

			dialog.addEventListener('cancel', (e) => {
				e.preventDefault();
				closeDialogAnimated(dialog);
			});

			dialog.addEventListener('close', () => {
				document.body.style.overflow = '';

				dispatchDialogEvent(dialog, 'dialog:close:end');

				const opener = dialog._lastFocus;
				if (opener) {
					setTimeout(() => opener.focus(), 0);
					opener.setAttribute('aria-expanded', 'false');
				}

				dialog._lastFocus = null;
			});
		});

		/* --------------------------------
		 * ハッシュ制御
		 * -------------------------------- */
		const shouldEnableHashControl = Array.from(dialogs).some(isHashControlEnabled);

		if (shouldEnableHashControl) {
			const handleHashChange = () => {
				const hash = window.location.hash.substring(1);

				dialogs.forEach((dialog) => {
					if (!isHashControlEnabled(dialog)) return;

					const opener = document.querySelector<HTMLButtonElement>(
						`.js-dialog-open[data-dialog-target="${dialog.id}"]`,
					);

					if (dialog.id === hash) {
						if (!dialog.open) dialog.showModal();

						requestAnimationFrame(() => {
							dialog.classList.add('is-open');
							resetDialogScroll(dialog);
							dispatchDialogEvent(dialog, 'dialog:open');
						});

						if (opener) opener.setAttribute('aria-expanded', 'true');
						dialog._lastFocus = null;

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
	},
};

export default dialog;
