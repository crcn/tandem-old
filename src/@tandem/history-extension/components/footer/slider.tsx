import "./slider.scss";

import * as React from "react";
import * as SliderComponent from "react-slider";
import { FrontEndApplication } from "@tandem/editor/application";
import { HistorySingletonDependency } from "@tandem/history-extension/dependencies";


export class HistorySliderComponent extends React.Component<{ app: FrontEndApplication }, any> {

  get history() {
    return HistorySingletonDependency.getInstance(this.props.app.dependencies);
  }

  onSliderChange(value) {
    var h = this.props.app.editor;
    // h.move(value);

    this.history.position = value;
  }

  render() {
    const history = this.history;

    if (history.length < 2) {
      return null;
    }

    return <SliderComponent
      max={history.length - 1}
      value={history.position}
      onChange={this.onSliderChange.bind(this)}
      className="m-history-slider" />;
  }
}

