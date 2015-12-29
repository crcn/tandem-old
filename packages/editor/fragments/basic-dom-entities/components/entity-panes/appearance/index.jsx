
import React from 'react';
import StyleReference from 'common/reference/style';
import TextInputComponent from 'common/components/inputs/text';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';

class AppearancePaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    // https://css-tricks.com/basics-css-blend-modes/
    var blendModes = [
      'normal',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'lumosity'
    ].map(function(value) {
      return {
        label: value.split('-').join(' '),
        value: value
      }
    })

    return <div className='m-appearance-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Opacity</label>
            <TextInputComponent reference={StyleReference.create(entity, 'opacity')}></TextInputComponent>
          </div>
          <div className='col-sm-6'>
            <label>Blend mode</label>
            <SearchDropdownComponent defaultLabel='- -' options={blendModes} reference={StyleReference.create(entity, 'mixBlendMode')}></SearchDropdownComponent>
          </div>
        </div>
      </div>

    </div>;
  }
}

export default AppearancePaneComponent;
