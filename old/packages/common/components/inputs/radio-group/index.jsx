import './index.scss';

import cx from 'classnames';
import React from 'react';

export class RadioGroupInputComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onSelect(value) {
    this.props.reference.setValue(value);
  }

  componentDidMount() {

  }

  render() {
    var ref = this.props.reference;

    return <ul className='input m-radio-group'>
      {
        this.props.children.map((child) => {
          return React.cloneElement(child, {
            onSelect: (value) => {
              this.onSelect(value);
            },
            key: child.props.value,
            selected: child.props.value === ref.getValue()
          });
        })
      }
    </ul>;
  }
}

export class RadioGroupItemComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onClick(event) {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.value);
    }
  }

  render() {

    var classNames = cx({
      selected: this.props.selected
    });

    return <li onClick={this.onClick.bind(this)} className={classNames}>
      { this.props.children }
    </li>;
  }
}
