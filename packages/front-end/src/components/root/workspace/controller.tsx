import * as React from "react";
import { RootState } from "../../../state";
import { Dispatch } from "redux";
import { LeftGutterComponent } from "./left-gutter";
const {
  Modal: ComponentPickerModal
} = require("../../component-picker/modal.pc");
const { Modal: QuickSearchModal } = require("../../quick-search/index.pc");
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { BaseWorkspaceProps, WorkspacePrompt } from "./index.pc";
import { mapStateToProps as mapStatetoPromptControllerProps } from "./prompt-controller";

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

export default (Base: React.ComponentClass<BaseWorkspaceProps>) =>
  DragDropContext(HTML5Backend)(
    class WorkspaceController extends React.PureComponent<Props> {
      render() {
        const { root, dispatch } = this.props;
        const workspaceProps = mapStatetoPromptControllerProps(root);
        return (
          <div>
            <Base
              leftGutterProps={{
                style: {
                  display: root.showSidebar === false ? "none" : "block"
                },
                children:
                  root.showSidebar === false ? (
                    []
                  ) : (
                    <LeftGutterComponent
                      editorWindows={root.editorWindows}
                      rootDirectory={root.projectDirectory}
                      dispatch={dispatch}
                      root={root}
                    />
                  )
              }}
              editorWindowsProps={{
                root,
                dispatch
              }}
              rightGutterProps={{
                root,
                dispatch
              }}
            />

            <QuickSearchModal root={root} dispatch={dispatch} />
            <ComponentPickerModal root={root} dispatch={dispatch} />
            {workspaceProps && <WorkspacePrompt {...workspaceProps} dispatch={dispatch} />}
          </div>
        );
      }
    }
  );
