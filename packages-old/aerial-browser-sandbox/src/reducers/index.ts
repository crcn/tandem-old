import {
  Bounds,
  Moved,
  MOVED,
  moveBounds,
  Resized,
  Removed,
  REMOVED,
  RESIZED,
  BaseEvent
} from "aerial-common2";
import { uniq, map } from "lodash";
import {
  SyntheticWindowLoaded,
  windowPatched,
  SYNTHETIC_WINDOW_RESOURCE_LOADED,
  SyntheticWindowResourceLoaded,
  SYNTHETIC_WINDOW_LOADED,
  SYNTHETIC_WINDOW_CHANGED,
  SYNTHETIC_WINDOW_RESOURCE_CHANGED,
  SyntheticWindowResourceChanged,
  SYNTHETIC_WINDOW_RECTS_UPDATED,
  SyntheticWindowChanged,
  SYNTHETIC_WINDOW_SCROLLED,
  FETCHED_CONTENT,
  FetchedContent,
  SyntheticWindowScrolled,
  syntheticWindowOpened,
  SYNTHETIC_WINDOW_MOVED,
  SYNTHETIC_WINDOW_CLOSED,
  FILE_CONTENT_CHANGED,
  SYNTHETIC_WINDOW_RESIZED,
  SyntheticWindowRectsUpdated,
  SyntheticWindowSourceChanged,
  OPEN_SYNTHETIC_WINDOW,
  SYNTHETIC_WINDOW_PROXY_OPENED,
  SyntheticWindowOpened,
  OpenPaperclipStateWindow,
  NewSyntheticWindowEntryResolved
} from "../actions";
import {
  SyntheticNode,
  SyntheticWindow,
  SYNTHETIC_WINDOW,
  removeSyntheticWindow,
  isSyntheticNodeType,
  getSyntheticWindow,
  createPaperclipState,
  updateSyntheticWindow,
  updatePaperclipState,
  createPaperclipStateRootState,
  PaperclipStateRootState,
  upsertSyntheticWindow,
  PaperclipState,
  setFileCacheItem,
  addPaperclipState,
  getPaperclipState,
  createSyntheticWindow
} from "../state";

const WINDOW_PADDING = 50;

const getBestWindowBounds = (browser: PaperclipState, bounds: Bounds) => {
  if (!browser.windows.length) return bounds;
  const rightMostWindow =
    browser.windows.length > 1
      ? browser.windows.reduce((a, b) => {
          return a.bounds.right > b.bounds.right ? a : b;
        })
      : browser.windows[0];

  return moveBounds(bounds, {
    left: rightMostWindow.bounds.right + WINDOW_PADDING,
    top: rightMostWindow.bounds.top
  });
};

export const PaperclipStateReducer = <
  TRootState extends PaperclipStateRootState
>(
  root: TRootState = createPaperclipStateRootState() as TRootState,
  event: BaseEvent
): TRootState => {
  switch (event.type) {
    case SYNTHETIC_WINDOW_PROXY_OPENED: {
      const { instance, parentWindowId } = event as SyntheticWindowOpened;
      let PaperclipState: PaperclipState;
      PaperclipState = getPaperclipState(root, instance.browserId);
      if (!PaperclipState) {
        console.warn(
          `Unable to find synthetic browser with ID ${
            instance.browserId
          }. It's likely that the app state was replaced.`
        );
        return root;
      }
      return upsertSyntheticWindow(root, PaperclipState.$id, instance.struct);
    }

    case SYNTHETIC_WINDOW_SCROLLED: {
      const {
        scrollPosition,
        syntheticWindowId
      } = event as SyntheticWindowScrolled;
      return updateSyntheticWindow(root, syntheticWindowId, {
        scrollPosition
      });
    }

    case FETCHED_CONTENT: {
      const { publicPath, content, mtime } = event as FetchedContent;
      return setFileCacheItem(publicPath, content, new Date(0), root);
    }

    case SYNTHETIC_WINDOW_RESIZED:
    case SYNTHETIC_WINDOW_MOVED: {
      const {
        instance: { $id, screenLeft, screenTop, innerWidth, innerHeight }
      } = event as SyntheticWindowChanged;
      return updateSyntheticWindow(root, $id, {
        bounds: {
          left: screenLeft,
          top: screenTop,
          right: screenLeft + innerWidth,
          bottom: screenTop + innerHeight
        }
      });
    }

    case SYNTHETIC_WINDOW_CLOSED: {
      const {
        instance: { $id }
      } = event as SyntheticWindowChanged;
      return removeSyntheticWindow(root, $id);
    }

    case MOVED: {
      const { itemId, itemType, point } = event as Moved;
      if (itemType === SYNTHETIC_WINDOW) {
        const window = getSyntheticWindow(root, itemId);
        if (window) {
          return updateSyntheticWindow(root, itemId, {
            bounds: moveBounds(window.bounds, point)
          });
        }
        break;
      }
      break;
    }

    case REMOVED: {
      const { itemId, itemType } = event as Removed;
      if (itemType === SYNTHETIC_WINDOW) {
        return removeSyntheticWindow(root, itemId);
      }

      break;
    }

    case SYNTHETIC_WINDOW_LOADED:
    case SYNTHETIC_WINDOW_CHANGED: {
      const { instance } = event as SyntheticWindowLoaded;
      return updateSyntheticWindow(root, instance.$id, instance.struct);
    }

    case SYNTHETIC_WINDOW_RECTS_UPDATED: {
      const {
        rects,
        styles,
        syntheticWindowId
      } = event as SyntheticWindowRectsUpdated;
      return updateSyntheticWindow(root, syntheticWindowId, {
        allComputedBounds: rects,
        allComputedStyles: styles
      });
    }

    case SYNTHETIC_WINDOW_RESOURCE_LOADED: {
      const { uri, syntheticWindowId } = event as SyntheticWindowResourceLoaded;
      const window = getSyntheticWindow(root, syntheticWindowId);
      return updateSyntheticWindow(root, syntheticWindowId, {
        externalResourceUris: uniq(window.externalResourceUris, uri)
      });
    }
  }

  return root;
};
