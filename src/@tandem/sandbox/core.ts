import { DependencyGraph } from "./dependency-graph";
import { FileCache, FileCacheProtocol } from "./file-cache";
import { FileEditor } from "./edit";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";
import { DependencyGraphProvider, DependencyGraphStrategyProvider } from "./dependency-graph";
import {
  FileCacheProvider,
  FileSystemProvider,
  FileEditorProvider,
  FileResolverProvider,
  ProtocolURLResolverProvider,
} from "./providers";

import { FileURLProtocol, HTTPURLProtocol, URLProtocolProvider } from "./url";

export function createSandboxProviders(fileSystemClass?: { new(): IFileSystem }, fileResoverClass?: { new(): IFileResolver }) {
  return [
    new FileSystemProvider(fileSystemClass || (ENV_IS_NODE ?  LocalFileSystem : RemoteFileSystem)),
    new FileResolverProvider(fileResoverClass || (ENV_IS_NODE ? LocalFileResolver : RemoteFileResolver)),
    new FileCacheProvider(FileCache),
    new URLProtocolProvider("file", FileURLProtocol),
    new URLProtocolProvider("http", HTTPURLProtocol),
    new URLProtocolProvider("https", HTTPURLProtocol),
    new URLProtocolProvider("cache", FileCacheProtocol),
    new FileEditorProvider(FileEditor),
    new DependencyGraphProvider(DependencyGraph)
  ];
}