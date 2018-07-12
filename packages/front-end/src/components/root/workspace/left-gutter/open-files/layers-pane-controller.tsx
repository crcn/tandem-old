import * as React from "react";
import { compose, pure } from "recompose";
import { RootState, openFile } from "../../../../../state";
import { getSyntheticDocumentByDependencyUri } from "../../../../../../node_modules/paperclip";
const { OpenModule } = require("./open-module.pc");

export type LayersPaneControllerOuterProps = {
  root: RootState;
};

export default compose<
  LayersPaneControllerOuterProps,
  LayersPaneControllerOuterProps
>(
  pure,
  Base => ({ root, ...rest }: LayersPaneControllerOuterProps) => {
    const content = root.openFiles.map(openFile => {
      return (
        <OpenModule
          graph={root.graph}
          key={openFile.uri}
          file={openFile}
          document={getSyntheticDocumentByDependencyUri(
            openFile.uri,
            root.documents,
            root.graph
          )}
          module={root.graph[openFile.uri].content}
        />
      );
    });
    return <Base {...rest} contentProps={{ children: content }} />;
  }
);
