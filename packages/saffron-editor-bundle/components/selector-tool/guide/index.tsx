import './index.scss';
import * as React from 'react';
import LineComponent from '../line/index';

export default class GuideComponent extends React.Component<any,any> {
  render() {
    const bounds  = this.props.bounds;
    const preview = this.props.app.preview;

    return (<div className='m-guide'>
      {
        ~bounds.guideLeft ?
          <LineComponent
            {...this.props}
            bounds={{
              left   : bounds.guideLeft,
              top    : 0,
              width  : 1,
              height : preview.canvasHeight,
              direction : 'ns',
            }}
            showStems={false}
            showDistance={false}
          />
        : void 0
      }

      {
        ~bounds.guideTop ?
          <LineComponent
            {...this.props}
            bounds={{
              left      : 0,
              top       : bounds.guideTop,
              width     : preview.canvasWidth,
              height    : 1,
              direction : 'ew',
            }}
            showStems={false}
            showDistance={false}
          />
        : void 0
      }
    </div>);
  }
}
