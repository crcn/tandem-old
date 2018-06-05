import { memoize } from "tandem-common";

export type FSSandboxRootState = {
  fileCache: FileCache;
};

export type FileCache = {
  [identifier: string]: FileCacheItem;
};

export enum FileCacheItemStatus {
  CREATED,
  LOADING,
  LOADED,
  SAVE_REQUESTED,
  SAVING
}

export type FileCacheItem = {
  uri: string;
  status: FileCacheItemStatus;
  dirty?: boolean;
  content: Buffer;
  mimeType: string;
};

export const queueOpenFile = <TState extends FSSandboxRootState>(
  uri: string,
  state: TState
): TState => {
  if (state.fileCache[uri]) {
    return state;
  }
  return {
    ...(state as any),
    fileCache: {
      ...state.fileCache,
      [uri]: createFileCacheItem(uri)
    }
  };
};

export const getFSItem = (uri: string, state: FSSandboxRootState) =>
  state.fileCache[uri];

export const queueSaveFile = <TState extends FSSandboxRootState>(
  uri: string,
  state: TState
): TState => {
  return updateFileCacheItem(
    { status: FileCacheItemStatus.SAVE_REQUESTED },
    uri,
    state
  );
};

export const updateFileCacheItem = <TState extends FSSandboxRootState>(
  properties: Partial<FileCacheItem>,
  uri: string,
  state: TState
): TState => ({
  ...(state as any),
  fileCache: {
    ...state.fileCache,
    [uri]: {
      ...state.fileCache[uri],
      ...properties,
      dirty: state.fileCache[uri].dirty || Boolean(properties.content)
    }
  }
});

const createFileCacheItem = (uri: string): FileCacheItem => ({
  uri,
  status: FileCacheItemStatus.CREATED,
  content: null,
  mimeType: null
});

export const getFileCacheItemDataUrl = memoize(
  ({ mimeType, content }: FileCacheItem) =>
    `data:${mimeType};base64, ${content.toString("base64")}`
);
