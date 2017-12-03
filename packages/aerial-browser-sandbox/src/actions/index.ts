// import { SEnvWindowInterface } from "../environment";
import { SyntheticDocument, SyntheticNode, SyntheticWindow } from "../state";
import { Request, BaseEvent, generateDefaultId, Bounds, Point, Action } from "aerial-common2";
import { RenderedClientRects, RenderedComputedStyleDeclarations, SEnvWindowInterface } from "../environment";

import { Mutation } from "source-mutation";

export const OPEN_SYNTHETIC_WINDOW               = "OPEN_SYNTHETIC_WINDOW";
export const TOGGLE_CSS_DECLARATION_PROPERTY     = "TOGGLE_CSS_DECLARATION_PROPERTY";
export const SYNTHETIC_WINDOW_RESOURCE_LOADED    = "SYNTHETIC_WINDOW_RESOURCE_LOADED";
export const NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED = "NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED";
export const FETCH_REQUEST = "FETCH_REQUEST";
export const SYNTHETIC_WINDOW_RECTS_UPDATED      = "SYNTHETIC_WINDOW_RECTS_UPDATED";
export const SYNTHETIC_WINDOW_LOADED             = "SYNTHETIC_WINDOW_LOADED";
export const SYNTHETIC_WINDOW_CHANGED            = "SYNTHETIC_WINDOW_CHANGED";
export const SYNTHETIC_NODE_TEXT_CONTENT_CHANGED = "SYNTHETIC_NODE_TEXT_CONTENT_CHANGED";
export const NODE_VALUE_STOPPED_EDITING          = "NODE_VALUE_STOPPED_EDITING";
export const EDIT_SOURCE_CONTENT                 = "EDIT_SOURCE_CONTENT";
export const MUTATE_SOURCE_CONTENT               = "MUTATE_SOURCE_CONTENT";
export const APPLY_FILE_MUTATIONS                = "APPLY_FILE_MUTATIONS";
export const DEFER_APPLY_FILE_MUTATIONS          = "DEFER_APPLY_FILE_MUTATIONS";
export const SYNTHETIC_WINDOW_SCROLLED           = "SYNTHETIC_WINDOW_SCROLLED";
export const SYNTHETIC_WINDOW_SCROLL             = "SYNTHETIC_WINDOW_SCROLL";
export const SYNTHETIC_WINDOW_OPENED             = "SYNTHETIC_WINDOW_OPENED";
export const SYNTHETIC_WINDOW_PROXY_OPENED       = "SYNTHETIC_WINDOW_PROXY_OPENED";
export const SYNTHETIC_WINDOW_MOVED              = "SYNTHETIC_WINDOW_MOVED";
export const SYNTHETIC_WINDOW_CLOSED             = "SYNTHETIC_WINDOW_CLOSED";
export const SYNTHETIC_WINDOW_RESIZED            = "SYNTHETIC_WINDOW_RESIZED";
export const SYNTHETIC_WINDOW_RESOURCE_CHANGED   = "SYNTHETIC_WINDOW_RESOURCE_CHANGED";
export const FILE_CONTENT_CHANGED = "FILE_CONTENT_CHANGED";
export const FETCHED_CONTENT      = "FETCHED_CONTENT";

export type SyntheticWindowSourceChanged = {
  type: string
  syntheticWindowId: string;
  window: any;
} & BaseEvent;

export type ToggleCSSDeclarationProperty = {
  cssDeclarationId: string;
  windowId: string;
  propertyName: string;
} & Action;

export type OpenSyntheticBrowserWindow = {
  state: Partial<SyntheticWindow>;
  syntheticBrowserId: string;
} & Request;

export type FileContentChanged = {
  filePath: string;
  publicPath: string;
  content: ArrayBuffer;
  mtime: Date;
} & BaseEvent;

export type FetchedContent = {
  publicPath: string;
  content: ArrayBuffer;
  mtime: Date;
} & BaseEvent;

export type NewSyntheticWindowEntryResolved = {
  location: string;
  syntheticBrowserId?: string;
} & BaseEvent;

export type SyntheticWindowRectsUpdated = {
  rects: RenderedClientRects;
  styles: RenderedComputedStyleDeclarations;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowLoaded = {
  instance: SEnvWindowInterface
} & BaseEvent;

export type SyntheticNodeValueStoppedEditing = {
  syntheticWindowId: string;
  nodeId: string;
} & BaseEvent;

export type SyntheticWindowResourceLoaded = {
  uri: string;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticNodeTextContentChanged = {
  syntheticWindowId: string;
  syntheticNodeId: string;
  textContent: string;
} & BaseEvent;

export type SyntheticWindowScrolled = {
  scrollPosition: Point;
  syntheticWindowId: string;
} & BaseEvent;

export type SyntheticWindowScroll = {
  scrollPosition: Point;
  syntheticWindowId: string;
} & Action;

export type SyntheticWindowOpened = {
  instance: SEnvWindowInterface;
  parentWindowId: string;
} & BaseEvent;

export type SyntheticWindowChanged = {
  instance: SEnvWindowInterface;
} & BaseEvent;

export type SyntheticWindowResourceChanged = {
  uri: string;
} & BaseEvent;

export type MutateSourceContentRequest<T extends Mutation<any>> = {
  type: string;
  mutation: T;
  content: string;
  contentType: string;
} & Request;

export type MutateSourceContentRequest2<T extends Mutation<any>> = {
  mutations: T[];
} & Request;

export type ApplyFileMutations = {
  type: string;
  mutations: Mutation<any>[];
} & Request;

export type FetchRequest = {
  info: any;
} & Request;

export type windowPatched = {
  type: string;
  syntheticWindowId: string;
  document: SyntheticDocument;
} & BaseEvent;

export const mutateSourceContentRequest = (content: string, contentType: string, mutation: Mutation<any>): MutateSourceContentRequest<any> => ({
  content,
  mutation,
  contentType,
  $id: generateDefaultId(),
  type: EDIT_SOURCE_CONTENT,
});

export const toggleCSSDeclarationProperty = (propertyName: string, cssDeclarationId: string, windowId: string): ToggleCSSDeclarationProperty => ({
  cssDeclarationId,
  windowId,
  propertyName,
  type: TOGGLE_CSS_DECLARATION_PROPERTY
});

export const mutateSourceContentRequest2 = (mutations: Mutation<any>[]): MutateSourceContentRequest2<any> => ({
  mutations: mutations.map((mutation => ({...mutation, target: { source: mutation.target.source }, child: (mutation as any).child && { source: (mutation as any).child.source } }))),
  $id: generateDefaultId(),
  type: MUTATE_SOURCE_CONTENT,
});

export const syntheticWindowOpened = (instance: SEnvWindowInterface, parentWindowId?: string): SyntheticWindowOpened => ({
  parentWindowId,
  instance,
  type: SYNTHETIC_WINDOW_OPENED
});

export const syntheticWindowProxyOpened = (instance: SEnvWindowInterface, parentWindowId?: string): SyntheticWindowOpened => ({
  parentWindowId,
  instance,
  type: SYNTHETIC_WINDOW_PROXY_OPENED
});

export const fetchedContent = (publicPath: string, content: ArrayBuffer): FetchedContent => ({
  type: FETCHED_CONTENT,
  publicPath,
  content,
  mtime: null
});

export const syntheticWindowMoved = (instance: SEnvWindowInterface): SyntheticWindowChanged => ({
  instance,
  type: SYNTHETIC_WINDOW_MOVED
});

export const syntheticWindowClosed = (instance: SEnvWindowInterface): SyntheticWindowChanged => ({
  instance,
  type: SYNTHETIC_WINDOW_CLOSED
});

export const syntheticWindowResized = (instance: SEnvWindowInterface): SyntheticWindowChanged => ({
  instance,
  type: SYNTHETIC_WINDOW_RESIZED
});

export const syntheticWindowResourceChanged = (uri: string): SyntheticWindowResourceChanged => ({
  uri,
  type: SYNTHETIC_WINDOW_RESOURCE_CHANGED
});

export const applyFileMutationsRequest = (...mutations: Mutation<any>[]): ApplyFileMutations => ({
  mutations,
  $id: generateDefaultId(),
  type: APPLY_FILE_MUTATIONS,
});

export const fetchRequest = (info: any): FetchRequest => ({
  info,
  type: FETCH_REQUEST,
  $id: generateDefaultId()
});


export const deferApplyFileMutationsRequest = (...mutations: Mutation<any>[]): ApplyFileMutations => ({
  mutations,
  $id: generateDefaultId(),
  type: DEFER_APPLY_FILE_MUTATIONS,
});

export const testMutateContentRequest = (contentType: string, mutationType?: string) => ((action: MutateSourceContentRequest<any>) => action.type === EDIT_SOURCE_CONTENT && action.contentType === contentType && (!mutationType || action.mutation.$type === mutationType));

export const syntheticNodeValueStoppedEditing = (syntheticWindowId: string, nodeId: string): SyntheticNodeValueStoppedEditing => ({
  nodeId,
  syntheticWindowId,
  type: NODE_VALUE_STOPPED_EDITING
});

export const syntheticWindowScrolled = (syntheticWindowId: string, scrollPosition: Point): SyntheticWindowScrolled => ({
  scrollPosition,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SCROLLED
});


export const syntheticWindowScroll = (syntheticWindowId: string, scrollPosition: Point): SyntheticWindowScroll => ({
  scrollPosition,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_SCROLL
});

export const syntheticNodeTextContentChanged = (syntheticWindowId: string, syntheticNodeId: string, textContent: string): SyntheticNodeTextContentChanged => ({
  textContent,
  syntheticNodeId,
  syntheticWindowId,
  type: SYNTHETIC_NODE_TEXT_CONTENT_CHANGED
});

export const openSyntheticWindowRequest = (state: Partial<SyntheticWindow>, syntheticBrowserId?: string, fromSavedState?: boolean): OpenSyntheticBrowserWindow => ({
  state,
  syntheticBrowserId,
  type: OPEN_SYNTHETIC_WINDOW,
  $id: generateDefaultId()
});

export const newSyntheticWindowEntryResolved = (location: string, syntheticBrowserId?: string): NewSyntheticWindowEntryResolved => ({
  location,
  syntheticBrowserId,
  type: NEW_SYNTHETIC_WINDOW_ENTRY_RESOLVED,
});

export const syntheticWindowRectsUpdated = (syntheticWindowId: string, rects: RenderedClientRects, styles: RenderedComputedStyleDeclarations): SyntheticWindowRectsUpdated => ({
  rects,
  styles,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RECTS_UPDATED,
});


export const syntheticWindowResourceLoaded = (syntheticWindowId: string, uri: string): SyntheticWindowResourceLoaded => ({
  uri,
  syntheticWindowId,
  type: SYNTHETIC_WINDOW_RESOURCE_LOADED,
});

export const syntheticWindowLoaded = (instance: SEnvWindowInterface): SyntheticWindowLoaded => ({
  instance,
  type: SYNTHETIC_WINDOW_LOADED,
});


export const syntheticWindowChanged = (instance: SEnvWindowInterface): SyntheticWindowLoaded => ({
  instance,
  type: SYNTHETIC_WINDOW_CHANGED,
});