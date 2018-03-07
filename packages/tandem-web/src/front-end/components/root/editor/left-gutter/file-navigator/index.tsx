

import "./index.scss";
import * as React from "react";
import { compose } from "recompose";
import { PaneComponent } from "front-end/components/pane";

/*

TODO:

- [ ] create new file
- [ ] add new folder
*/
const BaseFileNavigatorHeaderComponent = () => <div className="header">
        HEADER
</div>;

const FileNavigatorHeaderComponent = BaseFileNavigatorHeaderComponent;

const BaseFileNavigatorPaneComponent = () => <PaneComponent header={<FileNavigatorHeaderComponent />} className="m-file-navigator-pane">
        TODOS
</PaneComponent>

export const FileNavigatorPaneComponent = BaseFileNavigatorPaneComponent;


