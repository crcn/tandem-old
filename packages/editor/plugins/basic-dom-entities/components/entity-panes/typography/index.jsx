import './index.scss';

import React from 'react';

class TypographyPaneComponent extends React.Component {
  render() {
    return <div className='m-typography-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Family</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-6'>
            <label>Style</label>
            <input type='text'></input>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-3'>
            <label>Size</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>Color</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-6'>
            <label>Align</label>
            <input type='text'></input>
          </div>
        </div>
      </div>

    </div>;
  }
}
export default TypographyPaneComponent;
