export type PluginPhase = 'setup' | 'init' | 'observe';

export interface KakuPlugin {
	phase?: PluginPhase;
	init: () => void | Promise<void>;
}
