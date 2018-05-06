

import "./index.scss";
import * as React from "react";
import { compose } from "recompose";
import { PaneComponent } from "../../../../pane";
import { Dispatch } from "redux";
import { Directory } from "../../../../../../common";

/*

TODO:

- [ ] create new file
- [ ] add new folder
*/

const BaseFileNavigatorHeaderComponent = () => <div className="header">
  Files
</div>;

type FileNavigatorPaneOuterProps = {
  dispatch: Dispatch<any>;
  rootDirectory: Directory;
};

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;

const BaseFileNavigatorPaneComponent = (props: FileNavigatorPaneOuterProps) => <PaneComponent header={<FileNavigatorHeaderComponent />} className="m-file-navigator-pane">
        <div className="m-content">
          {JSON.stringify(props.rootDirectory)}
        </div>
</PaneComponent>



export const FileNavigatorPaneComponent = BaseFileNavigatorPaneComponent;


