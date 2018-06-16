import * as React from "react";
import { compose, pure } from "recompose";
import { Editor, RootState, isImageMimetype } from "../../../../state";
import { Dispatch } from "redux";
import { StageComponent as PaperclipStageComponent } from "./paperclip/stage";
import { ImageEditorComponent } from "./image";
import { PAPERCLIP_MIME_TYPE } from "paperclip";
import { getFSItem } from "fsbox";

export type EditorOuterProps = {
  editor: Editor;
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorInnerProps = {
  onTabClick: () => any;
} & EditorOuterProps;

export default compose(
  pure,
  Base => ({ editor, root, dispatch }: EditorInnerProps) => {
    const dependency =
      window && root.graph && root.graph[editor.activeFilePath];
    const fileCacheItem = getFSItem(editor.activeFilePath, root);

    if (!fileCacheItem.content) {
      return null;
    }

    let stage = null;

    if (fileCacheItem.content) {
      if (fileCacheItem.mimeType === PAPERCLIP_MIME_TYPE) {
        stage = (
          <PaperclipStageComponent
            root={root}
            dispatch={dispatch}
            dependency={dependency}
            editor={editor}
          />
        );
      } else if (isImageMimetype(fileCacheItem.mimeType)) {
        stage = (
          <ImageEditorComponent
            root={root}
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
          editor
        }}
        contentProps={{ children: stage }}
      />
    );
  }
);
