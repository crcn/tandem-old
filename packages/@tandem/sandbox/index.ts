import { CommandFactoryProvider } from "@tandem/common";
import { WriteFileCommand, ReadFileCommand } from "./commands";
import { ReadFileRequest, WriteFileRequest } from "./messages";

export const createRemoteProtocolProviders = () => {
  return [
    new CommandFactoryProvider(ReadFileRequest.READ_FILE, ReadFileCommand),
    new CommandFactoryProvider(WriteFileRequest.WRITE_FILE, WriteFileCommand)
  ];
}

export * from "./providers";
export * from "./messages";
export * from "./synthetic";
export * from "./file-system";
export * from "./resolver";
export * from "./dependency-graph";
export * from "./file-cache";
export * from "./sandbox";
export * from "./edit";
export * from "./core";
export * from "./uri";
export * from "./commands";
