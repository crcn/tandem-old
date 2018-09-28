import "./index.scss";
import * as React from "react";
import { Resizer } from "./resizer";
import { Dispatch } from "redux";
import {
  RootState,
  getBoundedSelection,
  EditorWindow,
  getSelectionBounds,
  Canvas
} from "../../../../../../../../../state";
import {
  getSyntheticVisibleNodeFrame,
  getSyntheticNodeById,
  SyntheticDocument,
  Frame,
  DependencyGraph
} from "paperclip";
import { getNestedTreeNodeById } from "tandem-common";

export type SelectionOuterProps = {
  canvas: Canvas;
  dispatch: Dispatch<any>;
  zoom: number;
  document: SyntheticDocument;
  frames: Frame[];
  documents: SyntheticDocument[];
  graph: DependencyGraph;
  selectedSyntheticNodeIds: string[];
  editorWindow: EditorWindow;
};

export type SelectionInnerProps = {
  setSelectionElement(element: HTMLDivElement);
  onDoubleClick(event: React.MouseEvent<any>);
} & SelectionOuterProps;

const SelectionBounds = ({
  zoom,
  selectedSyntheticNodeIds,
  graph,
  frames,
  documents
}: {
  document: SyntheticDocument;
  selectedSyntheticNodeIds: string[];
  graph: DependencyGraph;
  frames: Frame[];
  documents: SyntheticDocument[];
  zoom: number;
}) => {
  const entireBounds = getSelectionBounds(
    selectedSyntheticNodeIds,
    documents,
    frames,
    graph
  );
  const borderWidth = 1 / zoom;
  const boundsStyle = {
    position: "absolute",
    top: entireBounds.top,
    left: entireBounds.left,

    // round bounds so that they match up with the NWSE resizer
    width: entireBounds.right - entireBounds.left,
    height: entireBounds.bottom - entireBounds.top,
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
  };

  return <div style={boundsStyle as any} />;
};

export class SelectionCanvasTool extends React.PureComponent<
  SelectionOuterProps
> {
  onDoubleClick = (event: React.MouseEvent<any>) => {
    const {
      dispatch,
      selectedSyntheticNodeIds,
      documents,
      frames,
      graph
    } = this.props;
    const selection = getBoundedSelection(
      selectedSyntheticNodeIds,
      documents,
      frames,
      graph
    );
    if (selection.length === 1) {
      // dispatch(selectorDoubleClicked(selection[0], event));
    }
  };
  render() {
    const {
      canvas,
      editorWindow,
      selectedSyntheticNodeIds,
      documents,
      frames,
      graph,
      dispatch,
      document,
      zoom
    } = this.props;
    const { onDoubleClick } = this;
    const selection = getBoundedSelection(
      selectedSyntheticNodeIds,
      documents,
      frames,
      graph
    );
    if (!selection.length || editorWindow.secondarySelection) return null;
    if (!getNestedTreeNodeById(selectedSyntheticNodeIds[0], document)) {
      return null;
    }

    return (
      <div className="m-stage-selection-tool" onDoubleClick={onDoubleClick}>
        <SelectionBounds
          frames={frames}
          documents={documents}
          selectedSyntheticNodeIds={selectedSyntheticNodeIds}
          graph={graph}
          zoom={zoom}
          document={document}
        />
        <Resizer
          frames={frames}
          documents={documents}
          graph={graph}
          selectedSyntheticNodeIds={selectedSyntheticNodeIds}
          editorWindow={editorWindow}
          canvas={canvas}
          dispatch={dispatch}
          zoom={zoom}
        />
      </div>
    );
  }
}

export * from "./resizer";
