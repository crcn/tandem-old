import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import * as path from "path";
import { Dependency, PAPERCLIP_MIME_TYPE } from "paperclip";
import { compose, pure, withHandlers } from "recompose";
import { StageComponent as PaperclipStageComponent } from "./paperclip/stage";
import { ImageEditorComponent } from "./image";
import { RootState, Editor, isImageMimetype } from "../../../../state";
import { DragDropContext } from "react-dnd";
import { TabsComponent, TabItem } from "../../../tabs";
import { editorTabClicked } from "../../../../actions";
import { getFSItem } from "fsbox";

export type EditorOuterProps = {
  editor: Editor;
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorInnerProps = {
  onTabClick: () => any;
} & EditorOuterProps;

const EditorBaseComponent = ({
  editor,
  root,
  dispatch,
  onTabClick
}: EditorInnerProps) => {
  const dependency = window && root.graph && root.graph[editor.activeFilePath];

  const items: TabItem[] = editor.tabUris.map(tabUri => ({
    selected: editor.activeFilePath === tabUri,
    label: path.basename(tabUri),
    value: tabUri
  }));

  const fileCacheItem = getFSItem(editor.activeFilePath, root);

  if (!fileCacheItem.content) {
    return null;
  }

  let editorComponent = null;

  if (fileCacheItem.content) {
    if (fileCacheItem.mimeType === PAPERCLIP_MIME_TYPE) {
      editorComponent = (
        <PaperclipStageComponent
          root={root}
          dispatch={dispatch}
          dependency={dependency}
          editor={editor}
        />
      );
    } else if (isImageMimetype(fileCacheItem.mimeType)) {
      editorComponent = (
        <ImageEditorComponent
          root={root}
          dispatch={dispatch}
          fileCacheItem={fileCacheItem}
        />
      );
    }
  }

  return (
    <div className="m-editor">
      <TabsComponent
        style={{ height: "100%", width: "100%" } as any}
        items={items}
        onTabClick={onTabClick}
      >
        {editorComponent}
      </TabsComponent>
    </div>
  );
};

export const EditorComponent = compose<EditorOuterProps, EditorOuterProps>(
  pure,
  withHandlers({
    onTabClick: ({ dispatch, root }) => (item: TabItem) => {
      dispatch(editorTabClicked(item.value));
    }
  })
)(EditorBaseComponent);

export type EditorsOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorsInnerProps = {} & EditorsOuterProps;

const EditorsBaseComponent = ({ root, dispatch }: EditorsInnerProps) => {
  return (
    <div className="m-editors">
      {root.editors.map((editor, i) => {
        return (
          <EditorComponent
            key={i}
            editor={editor}
            root={root}
            dispatch={dispatch}
          />
        );
      })}
    </div>
  );
};

export const EditorsComponent = compose<EditorsOuterProps, EditorsOuterProps>(
  pure
)(EditorsBaseComponent);
