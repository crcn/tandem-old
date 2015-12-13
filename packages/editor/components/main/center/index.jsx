import './index.scss';

import React from 'react';

/**
* This is where all the visual editing happens
*/

class CenterComponent extends React.Component {
  render() {
    return <div className='m-editor-center'>
      {
        this.props.app.plugins.query({
          componentType: 'preview'
        }).map((plugin) => {
          return plugin.factory.create({ key: plugin.id, ...this.props });
        })
      }
    </div>;
  }
}

export default CenterComponent;
