import { DependencyGraph } from "./dependency-graph";
import { FileCache } from "./file-cache";
import { FileEditor } from "./edit";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";
import { WebpackDependencyGraphStrategy, WebpackProtocolResolver, DependencyGraphProvider, DependencyGraphStrategyProvider } from "./dependency-graph";
import {
  FileCacheProvider,
  FileSystemProvider,
  FileEditorProvider,
  FileResolverProvider,
  ProtocolURLResolverProvider,
} from "./providers";

export function createSandboxProviders(fileSystemClass?: { new(): IFileSystem }, fileResoverClass?: { new(): IFileResolver }) {
  return [
    new FileSystemProvider(fileSystemClass || (ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem)),
    new FileResolverProvider(fileResoverClass || (ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver)),
    new DependencyGraphStrategyProvider("webpack", WebpackDependencyGraphStrategy),
    new ProtocolURLResolverProvider("webpack", WebpackProtocolResolver),
    new FileCacheProvider(FileCache),
    new FileEditorProvider(FileEditor),
    new DependencyGraphProvider(DependencyGraph)
  ];
}