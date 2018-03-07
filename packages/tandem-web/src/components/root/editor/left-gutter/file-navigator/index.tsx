import "./index.scss";
import * as React from "react";
import { compose } from "recompose";
import { PanelComponent } from "components/panel";

const BaseFileNavigatorComponent = () => <PanelComponent header="Files" className="m-file-navigator">
        TODOS
</PanelComponent>

export const FileNavigatorComponent = BaseFileNavigatorComponent;


