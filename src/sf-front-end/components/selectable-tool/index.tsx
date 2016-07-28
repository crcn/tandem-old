// TODO - to make this faster, only display selectable
// areas when mouse hits the bounds of an item
import './index.scss';

import * as cx from 'classnames';
import * as React from 'react';
import { intersection } from 'lodash';
import { SelectAction } from 'sf-front-end/actions/index';
import { IVisibleEntity } from 'sf-core/entities';
import BoundingRect from 'sf-core/geom/bounding-rect';

import { ReactComponentFactoryFragment } from 'sf-front-end/fragments/index';

class SelectableComponent extends React.Component<{ entity: IVisibleEntity, selection: any, app: any, zoom: number }, any> {

  constructor() {
    super();
    this.state = {};
  }

  onMouseDown(event:any):void {
    // this.props.bus.execute(new SelectAction(this.props.entity, event.shiftKey));
    event.stopPropagation();
  }

  render() {
    var { entity, selection, app } = this.props;

    if (!entity.display) return null;
    const entities = entity.flatten();

    if (intersection(entities, selection || []).length) return null;

    // const bounds:BoundingRect = BoundingRect.merge(...entities.filter(function(entity) {
    //   return !!entity.display;
    // }).map(function(entity) {
    //   return entity.display.bounds;
    // }));

    const bounds = entity.display.bounds;

    bounds.left   *= this.props.zoom;
    bounds.right  *= this.props.zoom;
    bounds.top    *= this.props.zoom;
    bounds.bottom *= this.props.zoom;

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
    if (selection.display && selection.display.moving) return null;

    // if (selection.preview.currentTool.type !== 'pointer') return null;

    const selectables = allEntities.filter((entity) => (
      !!entity.display
    )).map((entity, i) => (
      <SelectableComponent
        {...this.props}
        zoom={1}
        selection={selection}
        entity={entity}
        key={i}
      />
    ));

    return (<div> {selectables} </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/tools/pointer/selectable', SelectablesComponent);
