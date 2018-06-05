import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { compose, pure } from "recompose";
import { FileCacheItem, getFileCacheItemDataUrl } from "fsbox";

export type ImageEditorOuterProps = {
  root: RootState;
  fileCacheItem: FileCacheItem;
  dispatch: Dispatch<any>;
};

export type ImageEditorInnerProps = {} & ImageEditorOuterProps;

export const BaseImageEditorComponent = ({
  fileCacheItem
}: ImageEditorInnerProps) => {
  return (
    <div className="m-image-editor">
      <img src={getFileCacheItemDataUrl(fileCacheItem)} />
    </div>
  );
};

export const ImageEditorComponent = compose<
  ImageEditorInnerProps,
  ImageEditorOuterProps
>(pure)(BaseImageEditorComponent);
