import * as React from "react";
import { EditorWindow, RootState, isImageMimetype } from "../../../../state";
import { Dispatch } from "redux";
import { StageComponent as PaperclipStageComponent } from "./paperclip/stage";
import { ImageEditorWindowComponent } from "./image";
import {
  PAPERCLIP_MIME_TYPE,
  InspectorNode,
  DependencyGraph,
  getInspectorNodeBySourceNodeId
} from "paperclip";
import { getFSItem } from "fsbox";
import { BaseEditorProps } from "./editor.pc";
import { TextEditorWindow } from "./text";
import { memoize, getNestedTreeNodeById } from "tandem-common";

export type Props = {
  editorWindow: EditorWindow;
  root: RootState;
  dispatch: Dispatch<any>;
};

const filterEditorInspectorNodes = memoize(
  (
    inspectorNodes: InspectorNode[],
    rootInspectorNode: InspectorNode,
    editor: EditorWindow,
    graph: DependencyGraph
  ) => {
    const moduleInspectorNode = getInspectorNodeBySourceNodeId(
      graph[editor.activeFilePath].content.id,
      rootInspectorNode
    );
    return inspectorNodes.filter(node =>
      getNestedTreeNodeById(node.id, moduleInspectorNode)
    );
  }
);

export default (Base: React.ComponentClass<BaseEditorProps>) =>
  class EditorController extends React.PureComponent<Props> {
    render() {
      const { editorWindow, root, dispatch } = this.props;

      if (!editorWindow) {
        return null;
      }
      const dependency =
        window && root.graph && root.graph[editorWindow.activeFilePath];
      const fileCacheItem = getFSItem(editorWindow.activeFilePath, root);

      if (!fileCacheItem || !fileCacheItem.content || !dependency) {
        return null;
      }

      const selectedTool = root.toolType;

      let stage = null;

      if (fileCacheItem.content) {
        if (fileCacheItem.mimeType === PAPERCLIP_MIME_TYPE) {
          stage = (
            <PaperclipStageComponent
              editMode={root.editMode}
              sourceNodeInspector={root.sourceNodeInspector}
              openFiles={root.openFiles}
              documents={root.documents}
              graph={root.graph}
              frames={root.frames}
              selectedInspectorNodes={filterEditorInspectorNodes(
                root.selectedInspectorNodes,
                root.sourceNodeInspector,
                editorWindow,
                root.graph
              )}
              hoveringInspectorNodes={filterEditorInspectorNodes(
                root.hoveringInspectorNodes,
                root.sourceNodeInspector,
                editorWindow,
                root.graph
              )}
              activeFilePath={root.activeEditorFilePath}
              toolType={selectedTool}
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
        } else {
          stage = (
            <TextEditorWindow
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
            editorWindow,
            selectedTool
          }}
          contentProps={{ children: stage }}
        />
      );
    }
  };
