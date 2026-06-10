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
			const targets = dialog.querySelectorAll<HTMLElement>('[data-dialog-scroll]');

			if (targets.length > 0) {
				targets.forEach((el) => {
					el.scrollTop = 0;
				});
				return;
			}

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

		/* --------------------------------
		 * モード・ハッシュ判定ヘルパー (追加・変更)
		 * -------------------------------- */
		const isHashControlEnabled = (dialog: DialogWithLastFocus) =>
			dialog.dataset.hashControl === 'true' && isModalMode(dialog);

		// モーダルかどうかを判定（data-dialog-mode="modeless" の場合は false を返す）
		const isModalMode = (dialog: DialogWithLastFocus) => dialog.dataset.dialogMode !== 'modeless';

		// モードに応じて開くメソッドを切り替える共通関数
		const openDialogByMode = (dialog: DialogWithLastFocus) => {
			if (isModalMode(dialog)) {
				dialog.showModal();
			} else {
				dialog.show();
			}
		};

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

				// 改修：モードを考慮して開く
				if (!targetDialog.open) openDialogByMode(targetDialog);

				requestAnimationFrame(() => {
					targetDialog.classList.add('is-open');
					resetDialogScroll(targetDialog);
					dispatchDialogEvent(targetDialog, 'dialog:open');
					updateNavButtons(targetDialog);
				});

				button.setAttribute('aria-expanded', 'true');

				// 改修：モーダルモードの時だけbodyのスクロールをロックする
				if (isModalMode(targetDialog)) {
					document.body.style.overflow = 'hidden';
				}

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
				// 改修：すべてのダイアログが閉じている、またはモーダルが残っていないか一応チェック（念のため）
				// 基本的にはそのまま戻して問題ないですが、モーダルの時だけロック解除の挙動に合わせます
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
						// 改修：モードを考慮して開く
						if (!dialog.open) openDialogByMode(dialog);

						requestAnimationFrame(() => {
							dialog.classList.add('is-open');
							resetDialogScroll(dialog);
							dispatchDialogEvent(dialog, 'dialog:open');
							updateNavButtons(dialog);
						});

						if (opener) opener.setAttribute('aria-expanded', 'true');
						dialog._lastFocus = null;

						// 改修：モーダルの時だけスクロールロック
						if (isModalMode(dialog)) {
							document.body.style.overflow = 'hidden';
						}
					} else if (dialog.open && dialog.id !== hash) {
						if (opener) opener.setAttribute('aria-expanded', 'false');
						closeDialogAnimated(dialog);
					}
				});
			};

			window.addEventListener('load', handleHashChange);
			window.addEventListener('hashchange', handleHashChange);
		}

		/* --------------------------------
		 * 前後ボタンの制御
		 * -------------------------------- */
		const updateNavButtons = (currentDialog: DialogWithLastFocus) => {
			const group = currentDialog.dataset.dialogGroup;
			if (!group) return;

			const isLoopEnabled = currentDialog.dataset.dialogLoop !== 'false';

			if (isLoopEnabled) return;

			const groupSelector = group ? `dialog.dialog[data-dialog-group="${group}"]` : 'dialog.dialog';
			const groupDialogs = Array.from(document.querySelectorAll<DialogWithLastFocus>(groupSelector));
			const currentIndex = groupDialogs.indexOf(currentDialog);

			const prevBtns = currentDialog.querySelectorAll<HTMLButtonElement>('.js-dialog-prev');
			const nextBtns = currentDialog.querySelectorAll<HTMLButtonElement>('.js-dialog-next');

			prevBtns.forEach((btn) => {
				btn.disabled = currentIndex === 0;
			});

			nextBtns.forEach((btn) => {
				btn.disabled = currentIndex === groupDialogs.length - 1;
			});
		};

		const switchDialog = (currentDialog: DialogWithLastFocus, direction: 'prev' | 'next') => {
			const group = currentDialog.dataset.dialogGroup;
			if (!group) return;

			const isLoopEnabled = currentDialog.dataset.dialogLoop !== 'false';

			const groupSelector = group ? `dialog.dialog[data-dialog-group="${group}"]` : 'dialog.dialog';
			const groupDialogs = Array.from(document.querySelectorAll<DialogWithLastFocus>(groupSelector));

			if (groupDialogs.length <= 1) return;

			const currentIndex = groupDialogs.indexOf(currentDialog);
			let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

			if (targetIndex >= groupDialogs.length) {
				if (!isLoopEnabled) return;
				targetIndex = 0;
			}
			if (targetIndex < 0) {
				if (!isLoopEnabled) return;
				targetIndex = groupDialogs.length - 1;
			}

			const targetDialog = groupDialogs[targetIndex];

			targetDialog._lastFocus = currentDialog._lastFocus;

			currentDialog._lastFocus = null;
			currentDialog.classList.remove('is-open');
			currentDialog.close();

			openDialogByMode(targetDialog);

			requestAnimationFrame(() => {
				targetDialog.classList.add('is-open');
				resetDialogScroll(targetDialog);
				dispatchDialogEvent(targetDialog, 'dialog:open');

				updateNavButtons(targetDialog);

				targetDialog.focus();

				if (isHashControlEnabled(targetDialog)) {
					history.replaceState(null, '', `#${targetDialog.id}`);
				}
			});
		};

		// 各ダイアログ内のボタンにイベント登録
		dialogs.forEach((dialog) => {
			dialog.querySelectorAll<HTMLButtonElement>('.js-dialog-prev').forEach((btn) => {
				btn.addEventListener('click', () => switchDialog(dialog, 'prev'));
			});

			dialog.querySelectorAll<HTMLButtonElement>('.js-dialog-next').forEach((btn) => {
				btn.addEventListener('click', () => switchDialog(dialog, 'next'));
			});

			dialog.addEventListener('keydown', (e: KeyboardEvent) => {
				const target = e.target as HTMLElement;
				if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
					return;
				}

				if (e.key === 'ArrowRight') {
					e.preventDefault();
					switchDialog(dialog, 'next');
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault();
					switchDialog(dialog, 'prev');
				}
			});
		});
	},
};

export default dialog;
