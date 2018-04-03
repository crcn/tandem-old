import { arraySplice, Directory, memoize, EMPTY_ARRAY, StructReference, Point, Translate, Bounds, pointIntersectsBounds, getSmallestBounds } from "common";
import { SyntheticBrowser, updateSyntheticBrowser, SyntheticWindow, updateSyntheticWindow, SyntheticDocument, getSyntheticWindow, SyntheticObjectType, getSyntheticDocumentComponent, getSyntheticWindowDependency, getComponentInfo } from "paperclip";
import { CanvasToolOverlayMouseMoved, CanvasToolOverlayClicked } from "../actions";
import { uniq } from "lodash";

export type Canvas = {
  mousePosition?: Point;
  movingOrResizing?: boolean;
  panning?: boolean;
  translate: Translate;
  secondarySelection?: boolean;
  fullScreen?: boolean;
};

export type RootState = {
  activeFilePath?: string;
  canvas: Canvas;
  mount: Element;
  hoveringReferences: StructReference[];
  selectionReferences: StructReference[];
  browser: SyntheticBrowser;
  projectDirectory?: Directory;
};

export const updateRootState = (properties: Partial<RootState>, root: RootState) => ({
  ...root,
  ...properties,
});

export const updateRootStateSyntheticBrowser = (properties: Partial<SyntheticBrowser>, root: RootState) => updateRootState({
  browser: updateSyntheticBrowser(properties, root.browser)
}, root);

export const updateRootStateSyntheticWindow = (location: string, properties: Partial<SyntheticWindow>, root: RootState) => updateRootState({
  browser: updateSyntheticWindow(location, properties, root.browser)
}, root);

export const updateRootStateSyntheticWindowDocument = (location: string, documentIndex: number, properties: Partial<SyntheticDocument>, root: RootState) => {
  const window = getSyntheticWindow(location, root.browser);
  return updateRootState({
    browser: updateSyntheticWindow(location, {
      documents: arraySplice(window.documents, documentIndex, 1, {
        ...window.documents[documentIndex],
        ...properties
      })
    }, root.browser)
  }, root);
};

export const setActiveFilePath = (newActiveFilePath: string, root: RootState) => {
  if (!root.browser.windows.some(({location}) => location === newActiveFilePath)) {
    throw new Error(`Active file path is not currently open`);
  }
  return updateRootState({
    activeFilePath: newActiveFilePath
  }, root);
};

export const updateCanvas = (properties: Partial<Canvas>, root: RootState) => {
  return updateRootState({
    canvas: {
      ...root.canvas,
      ...properties
    }
  }, root);
}

export const getActiveWindow = (root: RootState) => root.browser.windows.find(window => window.location === root.activeFilePath);

export const getAllWindowDocuments = memoize((browser: SyntheticBrowser): SyntheticDocument[] => {
  return browser.windows.reduce((documents, window) => {
    return [...documents, ...(window.documents || EMPTY_ARRAY)];
  }, []);
});

export const getCanvasTranslate = (canvas: Canvas) => canvas.translate;

export const getScaledMouseCanvasPosition = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked) => {
  const { sourceEvent: { pageX, pageY, nativeEvent } } = event as CanvasToolOverlayMouseMoved;
  const canvas     = state.canvas;
  const translate = getCanvasTranslate(canvas);

  const scaledPageX = ((pageX - translate.left) / translate.zoom);
  const scaledPageY = ((pageY - translate.top) / translate.zoom);
  return { left: scaledPageX, top: scaledPageY };
};

export const getCanvasMouseNodeTargetReference = (state: RootState, event: CanvasToolOverlayMouseMoved|CanvasToolOverlayClicked): StructReference => {

  const canvas     = state.canvas;
  const translate = getCanvasTranslate(canvas);

  const {left: scaledPageX, top: scaledPageY } = getScaledMouseCanvasPosition(state, event);

  const activeWindow = getActiveWindow(state);

  const document = getAllWindowDocuments(state.browser).find((document) => {
    return pointIntersectsBounds({ left: scaledPageX, top: scaledPageY }, document.bounds)
  });

  if (!document) return null;

  const mouseX = scaledPageX - document.bounds.left;
  const mouseY = scaledPageY - document.bounds.top;

  const computedInfo = document.computed || {};
  const intersectingBounds: Bounds[] = [];
  const intersectingBoundsMap = new Map<Bounds, string>();
  for (const $id in computedInfo) {
    const { rect } = computedInfo[$id];
    if (pointIntersectsBounds({ left: mouseX, top: mouseY }, rect)) {
      intersectingBounds.push(rect);
      intersectingBoundsMap.set(rect, $id);
    }
  }

  if (!intersectingBounds.length) return null;
  const smallestBounds = getSmallestBounds(...intersectingBounds);
  return {
    type: SyntheticObjectType.ELEMENT,
    id: intersectingBoundsMap.get(smallestBounds)
  };
}

export const setSelection = (root: RootState, ...selectionIds: StructReference[]) => {
  return updateRootState({
    selectionReferences: uniq([...selectionIds])
  }, root);
};

export * from "./constants";
