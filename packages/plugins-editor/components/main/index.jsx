import React from 'react';
import Pane from 'component-pane';

class MainComponent extends React.Component {
    render() {
        return <div className='m-editor'>
          <Pane target={{id:'pane1'}} {...this.props} />
        </div>;
    }
}

export default MainComponent;
