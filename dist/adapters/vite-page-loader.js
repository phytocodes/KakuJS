async function runModule(loader) {
  const mod = await loader();
  const init = mod.default ?? mod.init;
  if (typeof init === "function") {
    await init();
  }
}
async function loadVitePageModules(options) {
  const { page, pagesGlob = {}, modulesGlob = {} } = options;
  for (const loader of Object.values(modulesGlob)) {
    await runModule(loader);
  }
  if (!page) return;
  const entry = Object.entries(pagesGlob).find(([path]) => path.endsWith(`/${page}.ts`));
  if (entry) {
    await runModule(entry[1]);
  }
}
export {
  loadVitePageModules
};
