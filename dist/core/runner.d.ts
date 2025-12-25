import { KakuPlugin } from './types.js';

declare function runPlugins(plugins: KakuPlugin[]): Promise<void>;

export { runPlugins };
