import { runPlugins } from "../core/runner";
import { loadVitePageModules } from "./vite-page-loader";
function createViteRuntime(config) {
  return {
    async init() {
      await runPlugins(config.plugins ?? []);
      await loadVitePageModules(config);
    }
  };
}
export {
  createViteRuntime
};
