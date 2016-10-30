import { Bundler } from "./bundle";
import { FileCache } from "./file-cache";
import { FileEditor } from "./editor";
import { WebpackBundleStrategy } from "./strategies";
import { Injector, ENV_IS_NODE } from "@tandem/common";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";
import {
  BundlerProvider,
  FileCacheProvider,
  FileSystemProvider,
  FileEditorProvider,
  BundleStrategyProvider,
  FileResolverProvider,
} from "./providers";

export function createSandboxProviders(fileSystemClass?: { new(): IFileSystem }, fileResoverClass?: { new(): IFileResolver }) {
  return new Injector(
    new FileSystemProvider(fileSystemClass || ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem),
    new FileResolverProvider(fileResoverClass || ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver),
    new BundleStrategyProvider("webpack", WebpackBundleStrategy),
    new FileCacheProvider(FileCache),
    new FileEditorProvider(FileEditor),
    new BundlerProvider(Bundler)
  );
}