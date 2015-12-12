import './index.scss';
import React from 'react';
import FontInputComponent from './font-input';
import Reference from 'common/reference';
import ObservableObject from 'common/object/observable';

function createStyleReference(entity, styleName) {
  return {
    getValue() {
      return entity.attributes.style[styleName];
    },
    setValue(value) {
       entity.setStyle({
         [styleName]: value
       })
    }
  };
}


/*
Typeface, Weight, Color, Size, Alignment, Width, Spacing, Opacity, Filters
*/

class TextPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    // TODO - this should be a plugin instead
    // Just get this to work for now
    var fonts = (this.props.app.fonts || []);

// <NumberInputComponent reference={createStyleReference(entity, 'fontSize' )} />
    return <div className='m-text-pane'>
      <FontInputComponent entity={entity} fonts={fonts} />
    </div>;
  }
}

export default TextPaneComponent;
