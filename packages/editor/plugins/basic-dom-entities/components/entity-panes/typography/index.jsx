import './index.scss';

import React from 'react';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import ColorInputComponent from 'common/components/inputs/color-picker';
import createStyleReference from '../transform/create-style-reference';

class TypographyPaneComponent extends React.Component {
  render() {
    var entity = this.props.app.focus;
    if (!entity) return null;

    return <div className='m-typography-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Family</label>
            <TextInputComponent reference={createStyleReference(entity, 'fontFamily')} selectAllOnFocus={true} />
          </div>
          <div className='col-sm-6'>
            <label>Style</label>
            <TextInputComponent reference={createStyleReference(entity, 'weight')}/>
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-3'>
            <label>Size</label>
            <UnitInputComponent reference={createStyleReference(entity, 'fontSize')} />
          </div>
          <div className='col-sm-3'>
            <label>Color</label>
            <ColorInputComponent reference={createStyleReference(entity, 'color')} />
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
