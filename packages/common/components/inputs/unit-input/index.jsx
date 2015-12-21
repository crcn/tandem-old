// FIXME: overly sophisticated number input is overly gross
// to look at. Clean me.

import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import MenuComponent from 'common/components/menu';
import SelectComponent from 'common/components/inputs/select';

import {
  tokenize as tokenizeCSS,
  stringifyToken as stringifyCSSToken
} from 'common/utils/html/css';

import {
  convertUnit
} from 'common/utils/html/css';

import { default as TextEditorComponent, CSSTokenizer } from 'common/components/text-editor';

// TODO - move me over to a utils directory
function calculatePercentages(entity) {
  var rparent = entity.parent;
  while(rparent.parent && /absolute|relative/.test(rparent.getStyle().position || '')) {
    rparent = rparent.parent;
  }

  var pStyle = rparent.getComputedStyle();
  var eStyle = entity.getComputedStyle();

  return {
    left   : eStyle.left   / pStyle.width,
    top    : eStyle.top    / pStyle.height,
    width  : eStyle.width  / pStyle.width,
    height : eStyle.height / pStyle.height
  }
}

class UnitTokenComponent extends React.Component {

  onUnitChange(unit) {
    var unitToken = this.props.token;
    var numberToken = this.props.line.tokens[unitToken.getColumn() - 1];
    var oldUnit = unitToken.value;
    unitToken.setValue(unit);
    var entity = this.props.editor.entity;
    var cstyle = entity.getComputedStyle();


    if (unitToken.value !== '%') {
      numberToken.setValue(
        convertUnit(String(cstyle.left), unitToken.value).replace(unitToken.value, '')
      )
    } else {
      numberToken.setValue((calculatePercentages(entity).left * 100).toFixed(3));
    }

  }

  render() {

    var items = [
      'px', 'pt', 'cm', 'mm', '%'
    ].map(function(unit) {
      return { label: unit, value: unit }
    });

    return <MenuComponent>
      { this.props.token.value }
      <SelectComponent onSelect={this.onUnitChange.bind(this)} items={items} />
    </MenuComponent>;
  }
}

var tokenFactory = {
  create(props) {
    var type = props.token.type;
    if (type === 'unit') {
      return <UnitTokenComponent {...props} />;
    }
  }
}

class UnitInputComponent extends React.Component {
  onInput(source) {
    this.props.reference.setValue(source);
  }

  render() {

    var value = this.props.reference.getValue();
    var style = {
      color: 'white'
    }

    return <TextEditorComponent
      className='m-unit-input'
      source={value}
      entity={this.props.entity}
      style={style}
      onChange={this.onInput.bind(this)}
      tokenizer={CSSTokenizer.create()}
      tokenComponentFactory={tokenFactory} />
  }
}

export default UnitInputComponent;
