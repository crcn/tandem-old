import React from 'react';
import Pane from 'component-pane';

class MainComponent extends React.Component {
    render() {
        return <div className='m-editor'>
          <Pane className="pane" />
        </div>;
    }
}

export default MainComponent;
