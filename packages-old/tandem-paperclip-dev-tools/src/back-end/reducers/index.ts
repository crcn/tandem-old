import { Action } from "redux";
import { ApplicationState, updateApplicationState, updateFileCacheItem, addComponentScreenshot, removeComponentScreenshot, removeFileCacheItem, addPreviewDocument, getLatestPreviewDocument, limitPreviewDocuments } from "../state";
import { WATCH_URIS_REQUESTED, WatchUrisRequested, FileAction, fileContentChanged, FILE_CONTENT_CHANGED, FileContentChanged, WATCHING_FILES, WatchingFiles, HEADLESS_BROWSER_LAUNCHED, HeadlessBrowserLaunched, ComponentScreenshotSaved, ComponentScreenshotRemoved, COMPONENT_SCREENSHOT_SAVED, COMPONENT_SCREENSHOT_REMOVED, ComponentScreenshotTaken, componentScreenshotRemoved, ComponentScreenshotRequested, COMPONENT_SCREENSHOT_STARTED, ComponentScreenshotStarted, INIT_SERVER_REQUESTED, InitServerRequested, FILE_REMOVED, DEPENDENCY_GRAPH_LOADED, DependencyGraphLoaded, PreviewEvaluated, PREVIEW_EVALUATED } from "../actions";
import { arrayRemoveItem } from "aerial-common2";

const MAX_PREVIEW_DOCUMENTS = 10;

export function mainReducer(state: ApplicationState, event: Action) {

  switch(event.type) {

    case INIT_SERVER_REQUESTED: {
      const { options } = event as InitServerRequested;
      return updateApplicationState(state, {
        options
      });
    }

    case WATCHING_FILES: {
      const { initialFileCache } = event as WatchingFiles; 
      return updateApplicationState(state, {
        fileCache: [
          ...(state.fileCache || []),
          ...initialFileCache
        ]
      });
    }

    case DEPENDENCY_GRAPH_LOADED: {
      const { graph } = event as DependencyGraphLoaded;
      return updateApplicationState(state, { graph });
    }
    
    case WATCH_URIS_REQUESTED: {
      const { uris } = event as WatchUrisRequested;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        watchUris: uris
      });
    }

    case PREVIEW_EVALUATED: {
      const { previewName, componentId, document } = event as PreviewEvaluated;
      return limitPreviewDocuments(componentId, previewName, MAX_PREVIEW_DOCUMENTS, addPreviewDocument(componentId, previewName, document, state));
    }
    
    case HEADLESS_BROWSER_LAUNCHED: {
      const { browser: headlessBrowser } = event as HeadlessBrowserLaunched;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        headlessBrowser
      });
    }
    
    
    case COMPONENT_SCREENSHOT_STARTED: {

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        shouldTakeAnotherScreenshot: false
      });
    }
    
    case COMPONENT_SCREENSHOT_SAVED: {
      const { uri, clippings } = event as ComponentScreenshotSaved;

      // TODO - purge uris that are not in cache
      return addComponentScreenshot({ uri, clippings }, state);
    }
    
    case COMPONENT_SCREENSHOT_REMOVED: {
      const { uri } = event as ComponentScreenshotRemoved;

      // TODO - purge uris that are not in cache
      return removeComponentScreenshot(uri, state);
    }
    
    case FILE_REMOVED: {
      const { filePath } = event as FileAction;
      return removeFileCacheItem(state, filePath);
    }

    case FILE_CONTENT_CHANGED: {
      const { filePath, mtime, content } = event as FileContentChanged;

      state = updateApplicationState(state, {
        shouldTakeAnotherScreenshot: true
      });
      return updateFileCacheItem(state, {
        filePath,
        mtime,
        content: typeof content === "object" ? content : new Buffer(content, "utf8"),
      });
    }
  }
 
  return state;
}