import React from 'react';
import { ENTITY_PREVIEW_CLICK, SetFocusMessage } from 'editor/message-types';

// import {
//   ENTITY_PREVIEW_CLICK,
//   PREVIEW_STAGE_CLICK,
//   ENTITY_PREVIEW_DOUBLE_CLICK,
//   GROUP_SELECTION,
//   SetFocusMessage,
//   SetToolMessage
// } from 'editor/message-types';

class SelectableComponent extends React.Component {

  focus(event) {
    this.props.app.notifier.notify(SetFocusMessage.create([this.props.entity], event.shiftKey));
    event.stopPropagation();
  }

  render() {

    var entity = this.props.entity;
    if (!entity.preview) return null;
    var bounds = entity.preview.getBoundingRect(true);

    var style = {
      background : 'transparent',
      position   : 'absolute',
      width      : bounds.width,
      height     : bounds.height,
      left       : bounds.left,
      top        : bounds.top
    };

    return <div style={style} onMouseDown={this.focus.bind(this)} />;
  }
}

class SelectablesComponent extends React.Component {
  render() {
    var currentLayerFocus = this.props.app.rootEntity;

    return <div>
      {
        currentLayerFocus.children.map((entity) => {
          return <SelectableComponent {...this.props} entity={entity} key={entity.id} />
        })
      }
    </div>;
  }
}

export default SelectablesComponent;
