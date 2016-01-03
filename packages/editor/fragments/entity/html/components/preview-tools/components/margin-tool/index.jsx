import './index.scss';
import React from 'react';
import {
  translateStyleToIntegers
} from 'common/utils/html/css';

class EntityMarginComponent extends React.Component {
  render() {

    var entBounds = this.props.entity.preview.getBoundingRect();
    var element   = this.props.entity.preview.getDisplayElement();
    //var calcStyle = this.props.entity.preview.getComputedStyle();

    var calcStyle = window.getComputedStyle(element);

    var margins = translateStyleToIntegers({
      left: calcStyle.marginLeft,
      top: calcStyle.marginTop,
      bottom: calcStyle.marginBottom,
      right: calcStyle.marginRight
    }, element);

    var style = {
      left: entBounds.left - margins.left,
      top: entBounds.top - margins.top,
      minWidth: entBounds.width + margins.left + margins.right,
      minHeight: entBounds.height + margins.top + margins.bottom,
      borderLeftWidth: margins.left,
      borderTopWidth: margins.top,
      borderBottomWidth: margins.bottom,
      borderRightWidth: margins.right
    };

    return <div style={style} className='m-margin-preview-tool--entity'>
      <div className='m-margin-preview-tool--entity-clip'></div>
    </div>
  }
}

class MarginToolComponent extends React.Component {
  render() {
    var selection = this.props.selection;
    return <div className='m-margin-preview-tool'>
      {
        selection.map(function(entity) {
          return <EntityMarginComponent entity={entity} key={entity.id} />;
        })
      }
    </div>
  }
}

export default MarginToolComponent;