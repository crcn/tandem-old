import { Engine, PaperclipConfig } from "paperclip";
import * as loaderUtils from "loader-utils";
import * as resolve from "resolve";

let _engine: Engine;

const getEngine = ({ moduleDirectories }: PaperclipConfig): Engine => {
  if (_engine) {
    return _engine;
  }
  return (_engine = new Engine());
};

module.exports = async function(source: string) {
  const options: PaperclipConfig = loaderUtils.getOptions(this) || {};

  if (!options.compilerOptions) {
    throw new Error(`missing compilerOptions property`);
  }
  if (!options.compilerOptions.name) {
    throw new Error(`missing compilerOptions.name`);
  }

  const callback = this.async();
  const engine = getEngine(options);
  const compiler = require(resolve.sync(options.compilerOptions.name, {
    basedir: process.cwd()
  }));
  const ast = await engine.parseContent(source);
  const sheet = await engine.evaluateContentStyles(source, this.resourcePath);

  const code = compiler.compile(
    { ast, sheet },
    this.resourcePath,
    options.compilerOptions
  );

  callback(null, code);
};
