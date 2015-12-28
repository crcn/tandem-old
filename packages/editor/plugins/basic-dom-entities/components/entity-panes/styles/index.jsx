import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';

class StyleDeclarationComponent extends React.Component {
  render() {

    var entity   = this.props.entity;
    var property = this.props.property;
    var value    = this.props.value;
    var plugin   = this.props.plugin;

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

class EntityStylesPaneComponent extends React.Component {

  render() {

    var entity = this.props.entity;
    var plugin = this.props.plugin;

    var styles = entity.getStyle();

    var rows = [];

    for (var styleName in styles) {

      var stylePlugin = this.props.app.plugins.queryOne({
        componentType : 'styleInput',
        styleName     : styleName
      });

      if (!stylePlugin || stylePlugin.styleType !== plugin.styleType) {
        continue;
      }

      rows.push(<StyleDeclarationComponent
        plugin={stylePlugin}
        app={this.props.app}
        entity={entity}
        property={styleName}
        value={styles[styleName]}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return app.plugins.indexOf(a.props.plugin) > app.plugins.indexOf(b.props.plugin) ? 1 : -1;
    });

    return <div className='m-styles-pane'>
      { rows }
    </div>;
  }
}

export default EntityStylesPaneComponent;
