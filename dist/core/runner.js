const PHASE_ORDER = ["setup", "init", "observe"];
async function runPlugins(plugins) {
  for (const phase of PHASE_ORDER) {
    for (const plugin of plugins) {
      if ((plugin.phase ?? "init") !== phase) continue;
      await plugin.init();
    }
  }
}
export {
  runPlugins
};
