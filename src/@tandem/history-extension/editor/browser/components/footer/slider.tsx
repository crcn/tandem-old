import "./slider.scss";

import React =  require("react");
import SliderComponent = require("react-slider");
// import { HistorySingletonProvider } from "@tandem/history-extension/providers";


export class HistorySliderComponent extends React.Component<{ app: any }, any> {

  get history(): any {
    return {};
    // return HistorySingletonProvider.getInstance(this.props.app.injector);
  }

  onSliderChange(value) {
    var h = this.props.app.workspace;
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

