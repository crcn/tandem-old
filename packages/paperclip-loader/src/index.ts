import { Engine } from "paperclip";
import * as loaderUtils from "loader-utils";
import * as resolve from "resolve";

let _engine: Engine;
let _disposeTimer;

const getEngine = (): Engine => {
  // clearTimeout(_disposeTimer);

  // Engine opens up a child process, so here's a hack for
  // disposing then engine if it's not used. 🤮
  // _disposeTimer = setTimeout(() => {
  //   _engine.dispose();
  //   _engine = undefined;
  // }, 1000 * 5);
  if (_engine) {
    return _engine;
  }
  return (_engine = new Engine());
};

module.exports = async function(source: string) {
  const options = loaderUtils.getOptions(this) || {};
  const callback = this.async();
  const engine = getEngine();
  const compiler = require(resolve.sync(options.compiler, {
    basedir: process.cwd()
  }));
  const ast = await engine.parseContent(source);
  const sheet = await engine.evaluateContentStyles(source, this.resourcePath);

  const code = compiler.compile({ ast, sheet }, this.resourcePath);

  callback(null, code);
};
