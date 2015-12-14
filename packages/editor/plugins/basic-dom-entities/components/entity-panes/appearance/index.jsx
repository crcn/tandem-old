import './index.scss';
import React from 'react';

class AppearancePaneComponent extends React.Component {
  render() {
    return <div className='m-appearance-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Opacity</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-6'>
            <label>Blend mode</label>
            <input type='text'></input>
          </div>
        </div>
      </div>

    </div>;
  }
}

export default AppearancePaneComponent;
