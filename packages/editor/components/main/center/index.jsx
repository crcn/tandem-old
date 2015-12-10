import './index.scss';

import React from 'react';
import sift from 'sift';

/**
* This is where all the visual editing happens
*/

class CenterComponent extends React.Component {
  render() {
    return <div className='m-editor-center'>
      {
        this.props.app.registry.filter(sift({
          componentType: 'preview'
        })).map((entry) => {
          return entry.factory.create({ key: entry.id, ...this.props });
        })
      }
    </div>;
  }
}

export default CenterComponent;
