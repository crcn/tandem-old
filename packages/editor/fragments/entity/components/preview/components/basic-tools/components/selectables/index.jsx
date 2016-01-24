// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import './index.scss';

import cx from 'classnames';
import React from 'react';
import intersection from 'lodash/array/intersection';
import { SetFocusMessage } from 'editor/message-types';
import { calculateBoundingRect } from 'common/utils/geom';

class SelectableComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown(event) {
    this.onMouseOut(event);
    this.props.app.notifier.notify(SetFocusMessage.create([this.props.entity], event.shiftKey));
    event.stopPropagation();
  }

  onMouseOver(event) {
    this.props.app.setProperties({
      hoverItem: this.props.entity
    });
  }

  onMouseOut(event) {
    this.props.app.setProperties({
      hoverItem: void 0
    });
  }

  render() {

    var entity = this.props.entity;
    if (!entity.preview) return null;
    var entities = entity.flatten();

    if (intersection(entities, this.props.app.selection || []).length) return null;

    var bounds = calculateBoundingRect(entities.map(function(entity) {
        return entity.preview ? entity.preview.getBoundingRect(true) : void 0;
    }).filter(function(bounds) {
        return !!bounds;
    }));

    var classNames = cx({
      'm-selectable' : true,
      'hover'        : this.props.app.hoverItem === entity
    });

    var style = {
      background : 'transparent',
      position   : 'absolute',
      width      : bounds.width,
      height     : bounds.height,
      left       : bounds.left + 1,
      top        : bounds.top + 1
    };

    return <div style={style}
      className={classNames}
      onMouseOver={this.onMouseOver.bind(this)}
      onMouseOut={this.onMouseOut.bind(this)}
      onMouseDown={this.onMouseDown.bind(this)} />;
  }
}

class SelectablesComponent extends React.Component {
  render() {

    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.
    if (this.props.app.selection.preview && this.props.app.selection.preview.moving) return null;

    var selectables = this.props.app.rootEntity.flatten().filter((entity) => {
      return entity !== this.props.app.rootEntity && /component/.test(entity.type) && !/text/.test(entity.componentType);
    }).map((entity) => {
      return <SelectableComponent
        {...this.props}
        entity={entity}
        key={entity.id} />;
    });

    return <div> { selectables } </div>;
  }
}

export default SelectablesComponent;
