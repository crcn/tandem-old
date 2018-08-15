import * as React from "react";
import { compose, pure } from "recompose";
import { EditorWindow, RootState, isImageMimetype } from "../../../../state";
import { Dispatch } from "redux";
import { StageComponent as PaperclipStageComponent } from "./paperclip/stage";
import { ImageEditorWindowComponent } from "./image";
import { PAPERCLIP_MIME_TYPE } from "paperclip";
import { getFSItem } from "fsbox";

export type EditorWindowOuterProps = {
  editorWindow: EditorWindow;
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorWindowInnerProps = {
  onTabClick: () => any;
} & EditorWindowOuterProps;

export default compose(
  pure,
  Base => ({ editorWindow, root, dispatch }: EditorWindowInnerProps) => {
    if (!editorWindow) {
      return null;
    }
    const dependency =
      window && root.graph && root.graph[editorWindow.activeFilePath];
    const fileCacheItem = getFSItem(editorWindow.activeFilePath, root);

    if (!fileCacheItem.content) {
      return null;
    }

    let stage = null;

    if (fileCacheItem.content) {
      if (fileCacheItem.mimeType === PAPERCLIP_MIME_TYPE) {
        stage = (
          <PaperclipStageComponent
            sourceNodeInspector={root.sourceNodeInspector}
            openFiles={root.openFiles}
            documents={root.documents}
            graph={root.graph}
            frames={root.frames}
            selectedSyntheticNodeIds={root.selectedSyntheticNodeIds}
            hoveringInspectorNodeIds={root.hoveringInspectorNodeIds}
            hoveringSyntheticNodeIds={root.hoveringSyntheticNodeIds}
            activeFilePath={root.activeEditorFilePath}
            toolType={root.toolType}
            dispatch={dispatch}
            dependency={dependency}
            editorWindow={editorWindow}
          />
        );
      } else if (isImageMimetype(fileCacheItem.mimeType)) {
        stage = (
          <ImageEditorWindowComponent
            dispatch={dispatch}
            fileCacheItem={fileCacheItem}
          />
        );
      }
    }

    return (
      <Base
        toolbarProps={{
          dispatch,
          editorWindow
        }}
        contentProps={{ children: stage }}
      />
    );
  }
);
