import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { Workspace } from "./workspace/view.pc";
import { Welcome } from "./welcome/view.pc";
import { RootState, isUnsaved, getBuildScriptProcess } from "../../state";
import { Chrome } from "./chrome.pc";

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
    const buildScriptProcess = getBuildScriptProcess(root);

    if (!root.projectInfo) {
      content = (
        <Welcome
          key="welcome"
          dispatch={dispatch}
          selectedDirectory={root.selectedDirectoryPath}
        />
      );
    } else {
      content = (
        <div key="workspace-root" className="m-root">
          <Workspace root={root} dispatch={dispatch} />
        </div>
      );
    }

    if (root.customChrome) {
      content = (
        <Chrome
          content={content}
          unsaved={isUnsaved(root)}
          projectInfo={root.projectInfo}
          dispatch={dispatch}
          buildButtonProps={{ dispatch, buildScriptProcess }}
        />
      );
    }

    return content;
  }
}
