import './index.scss';

import React from 'react';

/**
* This is where all the visual editing happens
*/

class CenterComponent extends React.Component {
  render() {
    return <div className='m-editor-center'>
      {
        this.props.app.fragments.query({
          componentType: 'preview'
        }).map((fragment) => {
          return fragment.factory.create({ key: fragment.id, ...this.props });
        })
      }
    </div>;
  }
}

export default CenterComponent;
