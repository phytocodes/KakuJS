export type PluginPhase = 'setup' | 'init' | 'observe';

export interface KakuPlugin {
	phase?: PluginPhase;
	init: () => void | Promise<void>;
}

export type ModuleExports = {
	default?: () => void | Promise<void>;
	init?: () => void | Promise<void>;
};
