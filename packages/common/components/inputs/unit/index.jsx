// FIXME: overly sophisticated number input is overly gross
// to look at. Clean me.

import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import MenuComponent from 'common/components/menu';
import SelectComponent from 'common/components/inputs/select';
import TextInputComponent from 'common/components/inputs/text';
import { UNIT } from 'common/fragment/queries';

import {
  parseUnit as parseCSSUnit,
  translateStyle,
  stringifyToken as stringifyCSSToken
} from 'common/utils/html/css';


import { default as TextEditorComponent, CSSTokenizer } from 'common/components/text-editor';

class UnitTokenComponent extends React.Component {

  onUnitChange(unit) {

    var reference   = this.props.editor.reference;
    var unitToken   = this.props.token;
    var numberToken = this.props.line.tokens[unitToken.getColumn() - 1];
    var oldUnit = unitToken.value;
    unitToken.setValue(unit);
    var entity = reference.target;
    var cstyle = entity.getComputedStyle();

    var translatedStyle = translateStyle(
      { [reference.property]: String(cstyle[reference.property]) },
      { [reference.property]: '0' + unitToken.value },
      entity.getComputer().getDisplayElement()
    )[reference.property];

    numberToken.setValue(String(parseCSSUnit(translatedStyle)[0]));
  }

  render() {
    return <MenuComponent tabbable={false}>
      { this.props.token.value }
      <SelectComponent
        onSelect={this.onUnitChange.bind(this)}
        options={this.props.editor.app.fragments.query(UNIT)} />
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

  onKeyDown(event) {
    var ref = this.props.reference;
    if (event.keyCode !== 38 && event.keyCode !== 40) return;

    var [length, unit] = parseCSSUnit(ref.getValue());

    var inc = 1;
    var m = event.keyCode === 38 ? 1 : -1;

    if (unit !== '%') {
      inc = parseCSSUnit(translateStyle('1px', unit))[0] * inc;
    }

    function round(number, fixed) {
      return Number(number.toFixed(fixed));
    }

    ref.setValue(round(length + inc * m, 3) + unit);
    event.preventDefault();
  }

  render() {
    return <TextInputComponent
      ref='editor'
      selectAllOnFocus={true}
      className='m-unit-input'
      onKeyDown={this.onKeyDown.bind(this)}
      reference={this.props.reference}
      app={this.props.app}
      entity={this.props.reference.target}
      tokenizer={CSSTokenizer}
      tokenComponentFactory={tokenFactory} />
  }
}

export default UnitInputComponent;
