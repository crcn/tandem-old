import { Action } from "redux";
import { ApplicationState, updateApplicationState, updateFileCacheItem, addComponentScreenshot, removeComponentScreenshot } from "../state";
import { WATCH_URIS_REQUESTED, WatchUrisRequested, FileAction, fileContentChanged, FILE_CONTENT_CHANGED, FileContentChanged, WATCHING_FILES, WatchingFiles, HEADLESS_BROWSER_LAUNCHED, HeadlessBrowserLaunched, ComponentScreenshotSaved, ComponentScreenshotRemoved, COMPONENT_SCREENSHOT_SAVED, COMPONENT_SCREENSHOT_REMOVED, ComponentScreenshotTaken, componentScreenshotRemoved, COMPONENT_SCREENSHOT_REQUESTED, ComponentScreenshotRequested, COMPONENT_SCREENSHOT_STARTED, ComponentScreenshotStarted } from "../actions";
import { arrayRemoveItem } from "aerial-common2";

export function mainReducer(state: ApplicationState, event: Action) {

  switch(event.type) {

    case WATCHING_FILES: {
      const { initialFileCache } = event as WatchingFiles; 
      return updateApplicationState(state, {
        fileCache: [
          ...(state.fileCache || []),
          ...initialFileCache
        ]
      });
    }
    
    case WATCH_URIS_REQUESTED: {
      const { uris } = event as WatchUrisRequested;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        watchUris: uris
      });
    }
    
    case HEADLESS_BROWSER_LAUNCHED: {
      const { browser: headlessBrowser } = event as HeadlessBrowserLaunched;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        headlessBrowser
      });
    }
    
    case COMPONENT_SCREENSHOT_REQUESTED: {
      const { componentId } = event as ComponentScreenshotRequested;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        componentScreenshotQueue: state.componentScreenshotQueue.indexOf(componentId) === -1 ? [...state.componentScreenshotQueue, componentId] : state.componentScreenshotQueue
      });
    }

    
    case COMPONENT_SCREENSHOT_STARTED: {
      const { componentId } = event as ComponentScreenshotStarted;

      // TODO - purge uris that are not in cache
      return updateApplicationState(state, {
        componentScreenshotQueue: arrayRemoveItem(state.componentScreenshotQueue, componentId)
      });
    }
    
    case COMPONENT_SCREENSHOT_SAVED: {
      const { uri, componentId } = event as ComponentScreenshotSaved;

      // TODO - purge uris that are not in cache
      return addComponentScreenshot(componentId, uri, state);
    }
    
    case COMPONENT_SCREENSHOT_REMOVED: {
      const { uri, componentId } = event as ComponentScreenshotRemoved;

      // TODO - purge uris that are not in cache
      return removeComponentScreenshot(componentId, uri, state);
    }

    case FILE_CONTENT_CHANGED: {
      const { filePath, mtime, content } = event as FileContentChanged;
      return updateFileCacheItem(state, {
        filePath,
        mtime,
        content: content as any,
      });
    }
  }
 
  return state;
}