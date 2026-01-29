import type { ModuleExports } from '../core/types';

type ViteGlob = Record<string, () => Promise<unknown>>;

export interface VitePageLoaderOptions {
	page?: string;
	pagesGlob?: ViteGlob;
	modulesGlob?: ViteGlob;
}

async function runModule(loader: () => Promise<unknown>): Promise<void> {
	const mod = (await loader()) as ModuleExports;
	const init = mod.default ?? mod.init;
	if (typeof init === 'function') {
		await init();
	}
}

export async function loadVitePageModules(options: VitePageLoaderOptions): Promise<void> {
	const { page, pagesGlob = {}, modulesGlob = {} } = options;

	// 共通 modules
	for (const loader of Object.values(modulesGlob)) {
		await runModule(loader);
	}

	if (!page) return;

	const entry = Object.entries(pagesGlob).find(([path]) => path.endsWith(`/${page}.ts`));

	if (entry) {
		await runModule(entry[1]);
	}
}
