import './index.scss';

import React from 'react';
import SliderComponent from 'react-slider';

// TODO - slider button should be clock that turns as it is scrubbed.
class HistorySliderComponent extends React.Component {

  onSliderChange(value) {
    var h = this.props.fragment.history;
    h.move(value);
  }

  render() {

    var fragment  = this.props.fragment;
    var history = fragment.history;

    if (history.length < 2) {
      return null;
    }

    return <SliderComponent
      max={history.length - 1}
      value={history.position}
      onChange={this.onSliderChange.bind(this)}
      className='m-history-slider' />;
  }
}

export default HistorySliderComponent;
