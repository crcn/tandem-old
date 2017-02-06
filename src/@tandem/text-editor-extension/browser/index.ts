
import { merge } from "lodash";
import { TextEditorComponent } from "./components";
import { URIProtocolProvider } from "@tandem/sandbox";
import { RootPlaygroundBrowserStore } from "./stores";
import { PlaygroundBrowserStoreProvider } from "./providers";
import { createHTMLEditorBrowserProviders } from "@tandem/html-extension/editor/browser";
import { HomeRouteHandler, ProjectRouteHandler } from "./routes";
import { createTDProjectEditorBrowserProviders } from "@tandem/tdproject-extension/editor/browser";
import { UpdateFileCacheRequest, FileCacheItemUpdatedMessage } from "./messages";
import { OpenFileCommand, UpdateFileCommand, WatchFilesCommand, UpdateTextEditorContentCommand } from "./commands";
import { Kernel, ServiceApplication, ApplicationServiceProvider, CommandFactoryProvider, LoadApplicationRequest } from "@tandem/common";
import { 
  OpenFileRequest,
  EditorFamilyType, 
  RouteFactoryProvider, 
  GlobalKeyBindingService,
  createEditorBrowserProviders, 
  EditorComponentFactoryProvider,
} from "@tandem/editor/browser";

export const createTextEditorProviders = () => {
  return [
    new PlaygroundBrowserStoreProvider(RootPlaygroundBrowserStore),
    new EditorComponentFactoryProvider("textEditor", TextEditorComponent as any),
    new CommandFactoryProvider(OpenFileRequest.OPEN_FILE, OpenFileCommand),
    new CommandFactoryProvider(UpdateFileCacheRequest.UPDATE_FILE_CACHE, UpdateFileCommand),
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, WatchFilesCommand),
    new CommandFactoryProvider(FileCacheItemUpdatedMessage.FILE_CACHE_ITEM_UPDATED, UpdateTextEditorContentCommand),
  ];
}
