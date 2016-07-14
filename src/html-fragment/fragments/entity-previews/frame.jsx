import React from 'react';
import { ReactComponentFactoryFragment } from 'common/react/fragments';
import IsolateComponent from 'common/react/components/isolate';

class FramePreviewComponent extends React.Component {
  render() {
    return <IsolateComponent style={this.props.entity}>

    </IsolateComponent>;
  }
}

export const fragment = ReactComponentFactoryFragment.create({
  ns: 'component/preview/frame',
  componentClass: FramePreviewComponent
})
