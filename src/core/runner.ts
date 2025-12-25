import type { KakuPlugin, PluginPhase } from './types';

const PHASE_ORDER: PluginPhase[] = ['setup', 'init', 'observe'];

export async function runPlugins(plugins: KakuPlugin[]): Promise<void> {
	for (const phase of PHASE_ORDER) {
		for (const plugin of plugins) {
			if ((plugin.phase ?? 'init') !== phase) continue;
			await plugin.init();
		}
	}
}
