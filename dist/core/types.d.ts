type PluginPhase = 'setup' | 'init' | 'observe';
interface KakuPlugin {
    phase?: PluginPhase;
    init: () => void | Promise<void>;
}

export type { KakuPlugin, PluginPhase };
