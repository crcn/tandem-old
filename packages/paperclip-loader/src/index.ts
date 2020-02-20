// Some inspiration from https://github.com/sveltejs/svelte-loader/blob/master/index.js
// License: https://github.com/sveltejs/svelte-loader#license

import {
  Engine,
  PaperclipConfig,
  stringifyCSSSheet,
  PC_CONFIG_FILE_NAME
} from "paperclip";
import * as loaderUtils from "loader-utils";
import * as resolve from "resolve";
import * as VirtualModules from "webpack-virtual-modules";
import * as path from "path";
import * as crc32 from "crc32";

let _engine: Engine;

type Options = {
  config: PaperclipConfig;
  emitCss?: boolean;
};

const getEngine = (): Engine => {
  if (_engine) {
    return _engine;
  }
  return (_engine = new Engine());
};

const virtualModuleInstances = new Map();

module.exports = async function(source: string) {
  if (this._compiler && !virtualModuleInstances.has(this._compiler)) {
    const modules = activatePlugin(new VirtualModules(), this._compiler);
    virtualModuleInstances.set(this._compiler, modules);
  }

  const virtualModules = virtualModuleInstances.get(this._compiler);

  this.cacheable();
  const callback = this.async();
  const resourcePath = this.resourcePath;

  const { config, emitCss }: Options = loaderUtils.getOptions(this) || {};

  if (!config) {
    throw new Error(`Config is missing`);
  }

  const engine = getEngine();
  const compiler = require(resolve.sync(config.compilerOptions.name, {
    basedir: process.cwd()
  }));
  const ast = await engine.parseContent(source);

  let code = compiler.compile({ ast }, resourcePath, config.compilerOptions);

  const virtSheet = await engine.evaluateContentStyles(source, resourcePath);
  const sheetCode = stringifyCSSSheet(virtSheet, null);

  if (emitCss) {
    const cssFileName = `${resourcePath}.css`;
    const sheetFilePath = path.join(path.dirname(resourcePath), cssFileName);
    virtualModules.writeModule(sheetFilePath, sheetCode);
    code = `require("${sheetFilePath}");\n${code}`;
  } else {
    code = injectSheet(sheetCode, code);
  }
  console.log(code);

  callback(null, code);
};

const injectSheet = (sheetText: string, code: string) => {
  return `
    if (typeof document !== "undefined") {
      const sheet = document.createElement("style");
      sheet.textContent = ${JSON.stringify(sheetText)};
      document.head.appendChild(sheet);
    }

    ${code}
  `;
};

const activatePlugin = (plugin, compiler) => {
  const { inputFileSystem, name, context, hooks } = compiler;
  plugin.apply({
    inputFileSystem,
    name,
    context,
    hooks: {
      ...hooks,
      afterResolvers: makeImmediateCallbackHook(hooks.afterResolvers),
      afterEnvironment: makeImmediateCallbackHook(hooks.afterEnvironment)
    }
  });
  return plugin;
};

const makeImmediateCallbackHook = hook => ({
  tap: (name: string, callback) => {
    hook.tap(name, callback);
    callback();
  }
});
