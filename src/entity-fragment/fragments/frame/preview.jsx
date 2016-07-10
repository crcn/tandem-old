import React from 'react';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

class FramePreviewComponent extends React.Component {
  render() {
    return <iframe ref='container'>

    </iframe>;
  }
}

export const fragment = ReactComponentFactoryFragment.create('components/preview/frame', FramePreviewComponent);
