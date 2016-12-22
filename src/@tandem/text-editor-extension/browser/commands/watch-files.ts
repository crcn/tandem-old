import { DSTailRequest, WritableStream, DuplexStream, DSTailedOperation } from "@tandem/mesh";
import { BaseEditorPlaygroundBrowserCommand } from "./base";
import { FILE_CACHE_COLLECTION_NAME, FileCacheItem } from "@tandem/sandbox";
import { Provider, inject, PropertyWatcher, PrivateBusProvider } from "@tandem/common";
import { FileCacheItemUpdatedMessage } from "../messages";

export class WatchFilesCommand extends BaseEditorPlaygroundBrowserCommand {
  execute() {

    let tail: DuplexStream<any, any>;
    
    this.editorStore.workspaceWatcher.connect((workspace) => {
      return workspace && workspace.envKernelWatcher.connect((kernel) => {
        if (!kernel) return;
        if (tail) tail.writable.getWriter().close();

        const envBus = PrivateBusProvider.getInstance(kernel);
        tail   = DSTailRequest.dispatch(FILE_CACHE_COLLECTION_NAME, {}, envBus);
        tail.readable.pipeTo(new WritableStream({
          write: (chunk: DSTailedOperation) => {
            const fileCache = kernel.inject(new FileCacheItem(chunk.data, FILE_CACHE_COLLECTION_NAME));
            this.bus.dispatch(new FileCacheItemUpdatedMessage(fileCache));
          }
        }))
      }).trigger();
    }).trigger();
  }
}