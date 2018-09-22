import "./index.scss";
import * as React from "react";
import { Dispatch } from "redux";
import { Workspace } from "./workspace/index.pc";
import { Welcome } from "./welcome/view.pc";
import { RootState } from "../../state";

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

    if (!root.projectInfo) {
      return <Welcome dispatch={dispatch} />;
    }

    return (
      <div className="m-root">
        <Workspace root={root} dispatch={dispatch} />
      </div>
    );
  }
}
