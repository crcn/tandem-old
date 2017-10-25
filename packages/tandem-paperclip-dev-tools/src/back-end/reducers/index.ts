import { Action } from "redux";
import { ApplicationState, updateApplicationState, updateFileCacheItem } from "../state";
import { WATCH_URIS_REQUESTED, WatchUrisRequested, FileAction, fileContentChanged, FILE_CONTENT_CHANGED, FileContentChanged, WATCHING_FILES, WatchingFiles } from "../actions";

export function mainReducer(state: ApplicationState, event: Action) {

  switch(event.type) {

    case WATCHING_FILES: {
      const { initialFileCache } = event as WatchingFiles; 
      return updateApplicationState(state, {
        fileCache: initialFileCache
      });
    }
    
    case WATCH_URIS_REQUESTED: {
      const { uris } = event as WatchUrisRequested;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        watchUris: uris
      });
    }
    case FILE_CONTENT_CHANGED: {
      const { filePath, mtime, content } = event as FileContentChanged;
      return updateFileCacheItem(state, {
        filePath,
        mtime,
        content,
      })
    }
  }
 
  return state;
}