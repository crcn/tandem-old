// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import './index.scss';

import * as cx from 'classnames';
import * as React from 'react';
import { intersection } from 'lodash';
import { SelectAction } from 'saffron-front-end/src/actions/index';
import { mergeBoundingRects } from 'saffron-front-end/src/utils/geom/index';
import { ReactComponentFactoryFragment } from 'saffron-front-end/src/fragments/index';

class SelectableComponent extends React.Component<{app:any, entity:any, bus:any, selection:any}, {}> {

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown(event:any):void {
    this.onMouseOut(event);
    this.props.bus.execute(new SelectAction(this.props.entity, event.shiftKey));
    event.stopPropagation();
  }

  onMouseOver() {
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
    var { entity, selection, app } = this.props;

    if (!entity.preview || entity.selectable === false) return null;
    const entities = entity.flatten();

    if (intersection(entities, selection || []).length) return null;

    const bounds = mergeBoundingRects(entities.map(function (entity2) {
      return entity2.preview ? entity2.preview.getBoundingRect(true) : void 0;
    }).filter(function (value) {
      return !!value;
    }));

    const classNames = cx({
      'm-selectable' : true,
      hover          : app.hoverItem === entity
    });

    const style = {
      background : 'transparent',
      position   : 'absolute',
      width      : bounds.width,
      height     : bounds.height,
      left       : bounds.left,
      top        : bounds.top
    };
  
    return (
      <div
        style={style}
        className={classNames}
        onMouseOver={this.onMouseOver.bind(this)}
        onMouseOut={this.onMouseOut.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
      />
    );
  }
}

export default class SelectablesComponent extends React.Component<{selection:any,allEntities:any, bus:any,app:any}, {}> {

  render() {

    const selection = this.props.selection || [];
    const allEntities = this.props.allEntities;

    // TODO - probably better to check if mouse is down on stage instead of checking whether the selected items are being moved.
    if (selection.preview && selection.preview.moving) return null;

    // if (selection.preview.currentTool.type !== 'pointer') return null;

    const selectables = allEntities.filter((entity) => (
      !!entity.preview
    )).map((entity) => (
      <SelectableComponent
        {...this.props}
        selection={selection}
        entity={entity}
        key={entity.id}
      />
    ));

    return (<div> {selectables} </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/tools/pointer/selectable', SelectablesComponent);
