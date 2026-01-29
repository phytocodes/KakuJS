type PluginPhase = 'setup' | 'init' | 'observe';
interface KakuPlugin {
    phase?: PluginPhase;
    init: () => void | Promise<void>;
}
type ModuleExports = {
    default?: () => void | Promise<void>;
    init?: () => void | Promise<void>;
};

export type { KakuPlugin, ModuleExports, PluginPhase };
