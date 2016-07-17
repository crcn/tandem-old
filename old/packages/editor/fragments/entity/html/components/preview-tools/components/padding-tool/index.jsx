import './index.scss';
import React from 'react';
import {
  translateStyleToIntegers
} from 'saffron-common/utils/html/css';

class EntityPaddingComponent extends React.Component {
  render() {

    var entBounds = this.props.entity.preview.getBoundingRect(true);
    var element   = this.props.entity.preview.getDisplayElement();
    var calcStyle = this.props.entity.preview.getStyle(true);

    var paddings = {
      left: calcStyle.paddingLeft,
      top: calcStyle.paddingTop,
      bottom: calcStyle.paddingBottom,
      right: calcStyle.paddingRight
    };

    var style = {
      left: entBounds.left + 1,
      top: entBounds.top + 1,
      width: entBounds.width,
      height: entBounds.height,
      borderLeftWidth: paddings.left,
      borderTopWidth: paddings.top,
      borderBottomWidth: paddings.bottom,
      borderRightWidth: paddings.right
    };

    return <div style={style} className='m-padding-preview-tool--entity'>
      <div className='m-padding-preview-tool--entity-clip'></div>
    </div>
  }
}

class PaddingToolComponent extends React.Component {
  render() {
    var selection = this.props.selection;
    return <div className='m-padding-preview-tool'>
      {
        selection.map(function(entity) {
          return <EntityPaddingComponent entity={entity} key={entity.id} />;
        })
      }
    </div>
  }
}

export default PaddingToolComponent;