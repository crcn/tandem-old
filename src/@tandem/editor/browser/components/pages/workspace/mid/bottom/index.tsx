import "./index.scss";
import cx = require("classnames");
import React = require("react");
import { GutterComponent } from "@tandem/uikit";
import { BaseApplicationComponent } from "@tandem/common";
import { BottomGutterTabComponentProvider } from "@tandem/editor/browser/providers";

export class BottomWorkspaceGutterComponent extends BaseApplicationComponent<{ className?: string, style?: Object }, { currentTabIndex: number }> {

  state = {
    currentTabIndex: 0
  };

  selectTabIndex = (index: number) => {
    this.setState({ currentTabIndex: index });
  }

  render() {
    const { style, className } = this.props;
    const { currentTabIndex } = this.state;

    const providers = this.kernel.queryAll<BottomGutterTabComponentProvider>(BottomGutterTabComponentProvider.getId("**"));
    const currentProvider = providers[currentTabIndex];

    return <GutterComponent className={cx(className, "bottom-workspace-gutter-component")} style={style}>
      <ul className="tabs">
        {
          providers.map((provider, index) => {
            
            return <li key={index} className={cx({ selected: provider === currentProvider })} onClick={this.selectTabIndex.bind(this, index)}>{ provider.label }</li>;
          })
        }
      </ul>
      <div className="current-tab">
        { currentProvider && currentProvider.create(this.props) }
      </div>
    </GutterComponent>
  }
}