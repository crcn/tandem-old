
import './text.scss';

import cx from 'classnames';
import React from 'react';
import AutosizeInput from 'react-input-autosize';
import FocusComponent from 'common/components/focus';

class TextLayerLabelComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  editLabel() {
    this.setState({
      edit: true
    })
  }

  render() {

    var edit = this.state.edit && !!~this.props.app.selection.indexOf(this.props.entity);

    return <span
      className='m-label m-text-layer-label'
      onDoubleClick={this.editLabel.bind(this)}>
      {
        this.state.edit         ?
        this.renderInput()      :
        this.props.entity.value
      }
    </span>;
  }

  onInputChange(event) {
    this.props.entity.setProperties({
      value: event.target.value
    });
  }

  doneEditing() {
    this.setState({ edit: false });
  }

  onInputKeyDown(event) {
    if (event.keyCode === 13) {
      this.doneEditing();
    }
  }

  onInputFocus(event) {
    event.target.select();
  }

  renderInput() {
    return <FocusComponent><AutosizeInput
      type='text'
      className='m-layer-label-input'
      onFocus={this.onInputFocus.bind(this)}
      value={this.props.entity.value}
      onChange={this.onInputChange.bind(this)}
      onBlur={this.doneEditing.bind(this)}
      onKeyDown={this.onInputKeyDown.bind(this)}
      /></FocusComponent>;
  }
}

export default TextLayerLabelComponent;
