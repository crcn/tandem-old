import * as React from "react";

export class ShareWorkspacePromptComponent extends React.Component<{ onClose: () => any }, any> {
  componentDidMount() {
    // setTimeout(() => {
    //   this.props.onClose();
    // }, 1000 * 5);
  }
  render() {
    return <div>
      <p>Share this link to allow people to collaborate with you:</p>
      <code>
        http://workspace.tandemcode.com/ff9030ss2
      </code>
    </div>;
  }
}