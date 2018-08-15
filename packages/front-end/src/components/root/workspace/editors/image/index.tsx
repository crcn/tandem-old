import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure } from "recompose";
import { FileCacheItem, getFileCacheItemDataUrl } from "fsbox";

export type ImageEditorWindowOuterProps = {
  fileCacheItem: FileCacheItem;
  dispatch: Dispatch<any>;
};

export type ImageEditorWindowInnerProps = {} & ImageEditorWindowOuterProps;

export const BaseImageEditorWindowComponent = ({
  fileCacheItem
}: ImageEditorWindowInnerProps) => {
  return (
    <div className="m-image-editor">
      <img src={getFileCacheItemDataUrl(fileCacheItem)} />
    </div>
  );
};

export const ImageEditorWindowComponent = compose<
  ImageEditorWindowInnerProps,
  ImageEditorWindowOuterProps
>(pure)(BaseImageEditorWindowComponent);
