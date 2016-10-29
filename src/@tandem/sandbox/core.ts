import { Bundler } from "./bundle";
import { FileCache } from "./file-cache";
import { FileEditor } from "./editor";
import { WebpackBundleStrategy } from "./strategies";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";
import { Dependencies, Injector, ENV_IS_NODE } from "@tandem/common";
import {
  BundlerDependency,
  FileCacheDependency,
  FileSystemDependency,
  FileEditorDependency,
  BundleStrategyDependency,
  FileResolverDependency,
} from "./dependencies";

export function createSandboxDependencies(fileSystemClass?: { new(): IFileSystem }, fileResoverClass?: { new(): IFileResolver }) {
  return new Dependencies(
    new FileSystemDependency(fileSystemClass || ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem),
    new FileResolverDependency(fileResoverClass || ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver),
    new BundleStrategyDependency("webpack", WebpackBundleStrategy),
    new FileCacheDependency(FileCache),
    new FileEditorDependency(FileEditor),
    new BundlerDependency(Bundler)
  );
}