import { KakuPlugin } from '../core/types.js';

type ViteGlob = Record<string, () => Promise<unknown>>;
interface ViteRuntimeConfig {
    page?: string;
    pagesGlob?: ViteGlob;
    modulesGlob?: ViteGlob;
    plugins?: KakuPlugin[];
}
declare function createViteRuntime(config: ViteRuntimeConfig): {
    init(): Promise<void>;
};

export { type ViteRuntimeConfig, createViteRuntime };
