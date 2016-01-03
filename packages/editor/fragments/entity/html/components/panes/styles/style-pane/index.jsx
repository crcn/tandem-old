import './index.scss';

import React from 'react';
import inflection from 'inflection';
import PaneComponent from 'common/components/pane';
import StyleReference from 'common/reference/style';
import PaneLabel from '../../pane-label/index.jsx';

class StyleDeclarationComponent extends React.Component {
  removeDeclaration() {
    this.props.reference.setValue(void 0);
  }
  render() {

    // camelCase to Camel Case
    var label = this.props.reference.property.split(/(?=[A-Z])/).map(function(word) {
      return inflection.titleize(word);
    }).join(' ');

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{label}</span> <span className='m-styles-pane--declaration-value'>{
      this.props.fragment.factory.create({
        ...this.props
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
    this.props.selection.setStyle({
      [prompt('style name')]: prompt('value')
    })
  }

  render() {

    var selection    = this.props.selection;
    var fragment     = this.props.fragment;
    var fragments    = this.props.app.fragments;

    var styles = selection.getStyle();

    var rows = [];

    for (var styleName in styles) {

      var styleFragment = fragments.queryOne({
        componentType : 'styleInput',
        styleName     : styleName
      });

      if (!styleFragment || styleFragment.styleCategory !== fragment.styleCategory) {
        continue;
      }

      rows.push(<StyleDeclarationComponent
        fragment={styleFragment}
        app={this.props.app}
        fragments={fragments}
        selection={selection}
        reference={StyleReference.create(selection, styleName)}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return fragments.indexOf(a.props.fragment) > fragments.indexOf(b.props.fragment) ? 1 : -1;
    });

    var label = <PaneLabel onAdd={this.addStyle.bind(this)}>
      { fragment.label }
    </PaneLabel>;

    return <PaneComponent label={label}>
      <div className='m-styles-pane'>
        { rows }
      </div>
    </PaneComponent>;
  }
}

export default EntityStylesPaneComponent;