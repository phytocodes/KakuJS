type ViteGlob = Record<string, () => Promise<unknown>>;
interface VitePageLoaderOptions {
    page?: string;
    pagesGlob?: ViteGlob;
    modulesGlob?: ViteGlob;
}
declare function loadVitePageModules(options: VitePageLoaderOptions): Promise<void>;

export { type VitePageLoaderOptions, loadVitePageModules };
