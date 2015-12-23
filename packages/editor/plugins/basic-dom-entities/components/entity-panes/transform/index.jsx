import './index.scss';
import React from 'react';
import UnitInputComponent from 'common/components/inputs/unit-input';
import StyleReference from 'common/reference/style';
import ScrollableLabelInput from 'common/components/inputs/scrollable-label-input'

class TransformPaneComponent extends React.Component {
  render() {
    var entity = this.props.app.focus;
    if (!entity) return null;

    return <div className='m-transform-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>x</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'left')} />
          </div>
          <div className='col-sm-6'>
            <label>y</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'top')} />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <label>w</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'width')} />
          </div>
          <div className='col-sm-6'>
            <label>h</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'height')} />
          </div>
        </div>

        <div className='row hidden'>
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
