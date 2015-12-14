import './index.scss';
import React from 'react';

class TransformPaneComponent extends React.Component {
  render() {
    return <div className='m-transform-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-3'>
            <label>x</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>y</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>w</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>h</label>
            <input type='text'></input>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-3'>
            <label>rx</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>ry</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>rz</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
          </div>
        </div>
      </div>

    </div>;
  }
}
export default TransformPaneComponent;
