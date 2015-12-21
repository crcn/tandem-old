// FIXME: overly sophisticated number input is overly gross
// to look at. Clean me.

import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  tokenize as tokenizeCSS,
  stringifyToken as stringifyCSSToken
} from 'common/utils/html/css';

import TextEditor from 'common/components/text-editor';


class UnitInputComponent extends React.Component {
  onInput(event) {

    var e = event.target;
    var v = e.value;
    this.props.reference.setValue(v);
    // console.log(e.setSelectionRange);
  }

  shouldComponentUpdate(nextProps) {
    console.log(this.refs.input.innerText, nextProps.reference.getValue());
    return this.refs.input.innerText !== String(nextProps.reference.getValue());
  }

  render() {

    var value = this.props.reference.getValue();
    var tokens = tokenizeCSS(value);

    return <div className='m-unit-input'>

    </div>;
  }
}

export default UnitInputComponent;
