import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { Workspace } from "./workspace/view.pc";
import { Welcome } from "./welcome/view.pc";
import { RootState, isUnsaved } from "../../state";
import { Chrome  } from "./chrome.pc";

export type RootOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

export class RootComponent extends React.PureComponent<RootOuterProps> {
  render() {
    const { root, dispatch } = this.props;
    // TODO - add loading state here
    if (!root.ready) {
      return null;
    }

    let content;

    if (!root.projectInfo) {
      content = <Welcome dispatch={dispatch} />;
    } else {
      content = <div className="m-root">
        <Workspace root={root} dispatch={dispatch} />
      </div>;
    }

    if (root.customChrome) {
      content = <Chrome content={content} unsaved={isUnsaved(root)} projectInfo={root.projectInfo} dispatch={dispatch} />;
    }

    return content;
  }
}
