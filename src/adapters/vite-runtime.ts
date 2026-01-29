import { runPlugins } from '../core/runner';
import type { KakuPlugin } from '../core/types';
import { loadVitePageModules } from './vite-page-loader';

type ViteGlob = Record<string, () => Promise<unknown>>;

export interface ViteRuntimeConfig {
	page?: string;
	pagesGlob?: ViteGlob;
	modulesGlob?: ViteGlob;
	plugins?: KakuPlugin[];
}

export function createViteRuntime(config: ViteRuntimeConfig) {
	return {
		async init(): Promise<void> {
			await runPlugins(config.plugins ?? []);
			await loadVitePageModules(config);
		},
	};
}
