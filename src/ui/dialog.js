export default function dialog() {

	const dialogs = document.querySelectorAll('dialog.dialog');
	const openButtons = document.querySelectorAll('.js-dialog-open');

	if (dialogs.length === 0) {
		// console.warn('ダイアログ要素が見つかりませんでした。');
		return;
	}

	// --- キャッシュ: ID => dialog 要素 ---
	const dialogMap = new Map();
	dialogs.forEach(d => dialogMap.set(d.id, d));

	const isHashControlEnabled = (dialog) => dialog.dataset.hashControl === 'true';

	// --- 閉じるアニメーション関数 ---
	const closeDialogAnimated = (dialog) => {
		if (!dialog.open || dialog.classList.contains('is-closing')) return;

		// ハッシュ制御が有効なら URL をリセット
		if (isHashControlEnabled(dialog) && window.location.hash === `#${dialog.id}`) {
			history.replaceState('', document.title, window.location.pathname + window.location.search);
		}

		dialog.classList.remove('is-open');
		dialog.classList.add('is-closing');

		const onTransitionEnd = (e) => {
			if (e.target !== dialog || e.propertyName !== 'opacity') return;
			dialog.removeEventListener('transitionend', onTransitionEnd);
			dialog.classList.remove('is-closing');
			dialog.close();
		};

		dialog.addEventListener('transitionend', onTransitionEnd);

		// フォールバック（transitionendが発火しない場合）
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
	openButtons.forEach(button => {
		// 初期状態: 閉じている
		button.setAttribute('aria-expanded', 'false');
		button.setAttribute('aria-haspopup', 'dialog');

		button.addEventListener('click', (e) => {
			e.preventDefault();
			const targetId = button.dataset.dialogTarget;
			const targetDialog = dialogMap.get(targetId);
			if (!targetDialog) return;

			// フォーカス復帰用にボタンを保存
			targetDialog._lastFocus = button;

			targetDialog.classList.remove('is-closing');
			if (!targetDialog.open) targetDialog.showModal();

			// Safari対策: 次フレームでクラス付与
			requestAnimationFrame(() => targetDialog.classList.add('is-open'));
			button.setAttribute('aria-expanded', 'true');

			document.body.style.overflow = 'hidden';

			// overlayスクロール位置リセット
			const container = targetDialog.querySelector('.dialog__overlay');
			if (container) container.scrollTop = 0;

			if (isHashControlEnabled(targetDialog)) {
				window.location.hash = targetId;
			}
		});
	});

	// --- ダイアログ閉じる処理 ---
	dialogs.forEach(dialog => {
		const inner = dialog.querySelector('.dialog__inner');

		// 内部の閉じるボタン
		dialog.querySelectorAll('.js-dialog-close').forEach(button => {
			button.addEventListener('click', () => closeDialogAnimated(dialog));
		});

		// オーバーレイクリックで閉じる
		dialog.addEventListener('click', (e) => {
			if (!inner.contains(e.target)) closeDialogAnimated(dialog);
		});

		// Esc キーで閉じる
		dialog.addEventListener('cancel', (e) => {
			e.preventDefault();
			closeDialogAnimated(dialog);
		});

		// 完全に閉じた後
		dialog.addEventListener('close', () => {
			document.body.style.overflow = '';

			const opener = dialog._lastFocus;
			if (opener && typeof opener.focus === 'function') {
				setTimeout(() => opener.focus(), 0);
			}

			// aria-expanded を false に戻す
			if (opener) opener.setAttribute('aria-expanded', 'false');

			dialog._lastFocus = null;
		});
	});

	// --- ハッシュで開閉制御 ---
	const shouldEnableHashControl = Array.from(dialogs).some(isHashControlEnabled);

	if (shouldEnableHashControl) {
		const handleHashChange = () => {
			const hash = window.location.hash.substring(1);

			dialogs.forEach(dialog => {
				if (!isHashControlEnabled(dialog)) return;
				const opener = document.querySelector(`.js-dialog-open[data-dialog-target="${dialog.id}"]`);

				if (dialog.id === hash) {
					if (!dialog.open) dialog.showModal();
					requestAnimationFrame(() => dialog.classList.add('is-open'));
					if (opener) opener.setAttribute('aria-expanded', 'true');

					dialog._lastFocus = null;
					const container = dialog.querySelector('.dialog__overlay');
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