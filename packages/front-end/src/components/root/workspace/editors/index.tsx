import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import * as path from "path";
import { Dependency } from "paperclip";
import { compose, pure, withHandlers } from "recompose";
import { StageComponent } from "./stage";
import { RootState, Editor } from "../../../../state";
import { DragDropContext } from "react-dnd";
import { TabsComponent, TabItem } from "../../../tabs";
import { editorTabClicked } from "../../../..";

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
  const dependency =
    window &&
    root.paperclip.graph &&
    root.paperclip.graph[editor.activeFilePath];

  const items: TabItem[] = editor.tabUris.map(tabUri => ({
    selected: editor.activeFilePath === tabUri,
    label: path.basename(tabUri),
    value: tabUri
  }));

  return (
    <div className="m-editor">
      <TabsComponent
        style={{ height: "100%", width: "100%" } as any}
        items={items}
        onTabClick={onTabClick}
      >
        <StageComponent
          root={root}
          dispatch={dispatch}
          dependency={dependency}
          editor={editor}
        />
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
