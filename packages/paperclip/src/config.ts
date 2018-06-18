import * as fs from "fs";
import * as path from "path";
import { PAPERCLIP_CONFIG_DEFAULT_FILENAME } from "./constants";
import { isPaperclipUri, DependencyGraph } from "./graph";
import { PCModule, createPCDependency } from "./dsl";
import { addProtocol, FILE_PROTOCOL } from "tandem-common";

export type PCConfigInfo = {
  directory: string;
  config: PCConfig;
};

// based on tsconfig
export type PCConfig = {
  rootDir: string;
  exclude: string[];
};

const DEFAULT_EXCLUDES = ["node_modules"];

export const createPCConfig = (
  rootDir: string,
  exclude: string[] = DEFAULT_EXCLUDES
): PCConfig => ({
  rootDir,
  exclude
});

export const DEFAULT_CONFIG = createPCConfig(".");

export const openPCConfig = (
  dir: string,
  configFileName: string = PAPERCLIP_CONFIG_DEFAULT_FILENAME
): PCConfigInfo => {
  const dirParts = dir.split("/");
  while (dirParts.length) {
    const possibleDir = dirParts.join("/");
    const configPath = path.join(possibleDir, configFileName);
    if (fs.existsSync(configPath)) {
      return {
        directory: possibleDir,
        config: JSON.parse(fs.readFileSync(configPath, "utf8"))
      };
    }
    dirParts.pop();
  }

  return { directory: dir, config: DEFAULT_CONFIG };
};

export const findPaperclipSourceFiles = (config: PCConfig, cwd: string) => {
  const pcFilePaths: string[] = [];
  walkPCRootDirectory(config, cwd, filePath => {
    if (isPaperclipUri(filePath)) {
      pcFilePaths.push(filePath);
    }
  });

  return pcFilePaths;
};

export const walkPCRootDirectory = (
  { rootDir, exclude }: PCConfig,
  cwd: string,
  each: (filePath: string, isDirectory?: boolean) => any
) => {
  const excludeRegexp = new RegExp(exclude.join("|"));
  const pcFilePaths: string[] = [];

  if (rootDir.charAt(0) === ".") {
    rootDir = path.resolve(cwd, rootDir);
  }

  walkFiles(rootDir, (filePath, isDirectory) => {
    if (excludeRegexp.test(filePath)) {
      return false;
    }
    each(filePath, isDirectory);
  });
};

const walkFiles = (
  filePath: string,
  each: (filePath: string, isDirectory?: boolean) => boolean | void
) => {
  const isDirectory = fs.lstatSync(filePath).isDirectory();
  if (each(filePath, isDirectory) === false) {
    return;
  }

  if (!isDirectory) {
    return;
  }

  const subpaths = fs
    .readdirSync(filePath)
    .map(basename => filePath + "/" + basename);

  for (let i = 0, { length } = subpaths; i < length; i++) {
    walkFiles(subpaths[i], each);
  }
};

export const loadFSDependencyGraphSync = (
  config: PCConfig,
  cwd: string,
  mapModule: (module: any) => PCModule
): DependencyGraph =>
  findPaperclipSourceFiles(config, cwd).reduce((config, sourceFilePath) => {
    const uri = addProtocol(FILE_PROTOCOL, sourceFilePath);
    const content = fs.readFileSync(sourceFilePath, "utf8") || "{}";

    return {
      ...config,
      [uri]: createPCDependency(uri, mapModule(JSON.parse(content)))
    };
  }, {});
