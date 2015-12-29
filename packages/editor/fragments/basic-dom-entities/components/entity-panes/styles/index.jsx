import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';
import PaneComponent from 'common/components/pane';

class StyleDeclarationComponent extends React.Component {
  removeDeclaration() {
    this.props.reference.setValue(void 0);
  }
  render() {

    var entity   = this.props.entity;
    var fragment   = this.props.fragment;

    // camelCase to Camel Case
    var label = this.props.reference.property.split(/(?=[A-Z])/).map(function(word) {
      return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
    }).join(' ');

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{label}</span> <span className='m-styles-pane--declaration-value'>{
        fragment.factory.create({
          app       : this.props.app,
          entity    : entity,
          reference : this.props.reference
        })
      }</span>
    <span className='declaration-remove' onClick={this.removeDeclaration.bind(this)}>
        &times;
      </span>
    </div>;
  }
}

class EntityStylesPaneComponent extends React.Component {

  addStyle() {
    this.props.entity.setStyle({
      [prompt('style name')]: prompt('value')
    })
  }

  render() {

    var entity = this.props.entity;
    var fragment = this.props.fragment;

    var styles = entity.getStyle();

    var rows = [];

    for (var styleName in styles) {

      var styleFragment = this.props.app.fragments.queryOne({
        componentType : 'styleInput',
        styleName     : styleName
      });

      if (!styleFragment || styleFragment.styleType !== fragment.styleType) {
        continue;
      }

      rows.push(<StyleDeclarationComponent
        fragment={styleFragment}
        app={this.props.app}
        entity={entity}
        reference={StyleReference.create(entity, styleName)}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return app.fragments.indexOf(a.props.fragment) > app.fragments.indexOf(b.props.fragment) ? 1 : -1;
    });

    var label = <span className='m-styles-pane--label'>
      { this.props.fragment.label }
      <span className='m-styles-pane--add-style' onClick={this.addStyle.bind(this)}>
        +
      </span>
    </span>;

    return <PaneComponent label={label}>
      <div className='m-styles-pane'>
        { rows }
      </div>
    </PaneComponent>;
  }
}

export default EntityStylesPaneComponent;
