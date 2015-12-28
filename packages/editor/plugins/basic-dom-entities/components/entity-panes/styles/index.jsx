import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';

class StyleDeclarationComponent extends React.Component {
  render() {

    var entity   = this.props.entity;
    var property = this.props.property;
    var value    = this.props.value;

    var plugin   = this.props.app.plugins.queryOne({
      componentType : 'styleInput',
      styleName     : property
    }) || this.props.app.plugins.queryOne({
      componentType : 'styleInput',
      styleName     : void 0
    });

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{property}</span> <span className='m-styles-pane--declaration-value'>{
        plugin.factory.create({
          app       : this.props.app,
          entity    : entity,
          reference : StyleReference.create(entity, property)
        })
      }</span>
    </div>;
  }
}

var order = [

  // transform
  'left', 'top', 'width', 'height', 'position',

  // typography
  'fontFamily', 'fontSize', 'textAlign', 'color'
];

var labels = {
  'left'       : 'x',
  'top'        : 'y',
  'fontFamily' : 'Font',
  'fontSize'   : 'Size',
  'color'      : 'Color',
  'textAlign'  : 'Alignment'
};

var categories = {
  'left'       : 'transform',
  'top'        : 'transform',
  'width'      : 'transform',
  'height'     : 'transform',
  'fontFamily' : 'typography',
  'fontSize'   : 'typography',
  'color'      : 'typography',
  'textAlign'  : 'typography'
}

var styleInfo = [
  { property: 'left'   , label: 'x', category: 'Transform' },
  { property: 'top'    , label: 'y', category: 'Transform' },
  { property: 'width'  ,             category: 'Transform' },
  { property: 'height' ,             category: 'Transform' },

  { property: 'fontFamily' , label: 'Font'      , category: 'Typography'  },
  { property: 'color'      , label: 'Color'     , category: 'Typography'  },
  { property: 'textAlign'  , label: 'Alignment' , category: 'Typography'  }
];

class EntityStylesPaneComponent extends React.Component {

  render() {

    var entity = this.props.entity;
    var plugin = this.props.plugin;

    var styles = entity.getStyle();

    var rows = [];

    for (var styleName in styles) {
      var category = categories[styleName];
      if (category !== plugin.styleType) continue;
      rows.push(<StyleDeclarationComponent
        app={this.props.app}
        entity={entity}
        property={styleName}
        value={styles[styleName]}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return order.indexOf(a.props.property) > order.indexOf(b.props.property) ? 1 : -1;
    });

    return <div className='m-styles-pane'>
      { rows }
    </div>;
  }
}

export default EntityStylesPaneComponent;
