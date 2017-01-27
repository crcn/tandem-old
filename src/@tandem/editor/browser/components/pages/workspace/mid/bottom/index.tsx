import "./index.scss";
import cx = require("classnames");
import React = require("react");
import { Workspace } from "@tandem/editor";
import { GutterComponent } from "@tandem/uikit";
import { BaseApplicationComponent } from "@tandem/common";
import { BottomGutterTabComponentProvider } from "@tandem/editor/browser/providers";
import { SyntheticDOMNode } from "@tandem/synthetic-browser";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";

export class BottomWorkspaceGutterComponent extends BaseApplicationComponent<{ className?: string, style?: Object, workspace: Workspace }, { currentTabIndex: number }> {

  state = {
    currentTabIndex: 0
  };

  selectTabIndex = (index: number) => {
    this.setState({ currentTabIndex: index });
  }

  render() {
    const { style, className, workspace } = this.props;
    const { currentTabIndex } = this.state;

    const selectedNode = workspace.selection.find((element) => {
      return element instanceof SyntheticDOMNode;
    }) as SyntheticDOMNode;

    const providers = this.kernel.queryAll<BottomGutterTabComponentProvider>(BottomGutterTabComponentProvider.getId("**"));
    const currentProvider = providers[currentTabIndex];

    const renderInner = () => {

      const activeSyntheticBrowser = (selectedNode as SyntheticRemoteBrowserElement).childBrowser || selectedNode.ownerDocument.browser;

      return <div className="inner">
        <ul className="tabs">
          {
            providers.map((provider, index) => {
              
              return <li key={index} className={cx({ selected: provider === currentProvider, "no-user-select": true })} onClick={this.selectTabIndex.bind(this, index)}>{ provider.label }</li>;
            })
          }
        </ul>
        <div className="current-tab">
          { currentProvider && currentProvider.create(Object.assign({}, this.props, { activeSyntheticBrowser })) }
        </div>
      </div>
    }

    return <GutterComponent className={cx(className, "bottom-workspace-gutter-component")} style={style}>
      { selectedNode && renderInner() }
    </GutterComponent>
  }
}