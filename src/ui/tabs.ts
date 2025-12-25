import type { KakuPlugin } from '../core/types';

const tabs: KakuPlugin = {
	phase: 'init',

	init() {
		const tabContainers = document.querySelectorAll<HTMLElement>('.tabs');

		if (!tabContainers.length) return;

		tabContainers.forEach((tabsContainer): void => {
			const tabs = tabsContainer.querySelectorAll<HTMLElement>('[role="tab"]');
			const panels = tabsContainer.querySelectorAll<HTMLElement>('[role="tabpanel"]');

			if (!tabs.length || !panels.length) return;

			const activateTabAndPanel = (targetTab: HTMLElement) => {
				// 1. すべてのタブを非アクティブに
				tabs.forEach((t): void => {
					t.setAttribute('aria-selected', 'false');
				});

				// 2. すべてのパネルを非表示
				panels.forEach((p) => {
					p.hidden = true;
				});

				// 3. 指定タブをアクティブに
				targetTab.setAttribute('aria-selected', 'true');

				// 4. 対応パネルを表示
				const targetId = targetTab.getAttribute('aria-controls');
				if (!targetId) {
					console.warn('aria-controls が設定されていないタブがあります:', targetTab);
					return;
				}

				const safeId = 'CSS' in window && 'escape' in CSS ? CSS.escape(targetId) : targetId;

				const panel = tabsContainer.querySelector<HTMLElement>(`#${safeId}`);

				if (!panel) {
					console.warn('対応するパネルが見つかりません:', targetId);
					return;
				}

				panel.hidden = false;
			};

			// --- 初期化 ---
			activateTabAndPanel(tabs[0]);

			// --- イベント ---
			tabs.forEach((tab) => {
				tab.addEventListener('click', () => {
					activateTabAndPanel(tab);
				});
			});
		});
	},
};

export default tabs;
