import './index.scss';

import * as React from 'react';
import { flatten } from 'lodash';
import RulerComponent from './ruler/index';
import GuideComponent from './guide/index';
import ResizerComponent from './resizer/index';
import BoundingRect from 'saffron-front-end/src/geom/bounding-rect';
import { ReactComponentFactoryFragment } from 'saffron-front-end/src/fragments/index';

export default class SelectorComponent extends React.Component<any, any> {

  constructor() {
    super();
    this.state = {
      moving: false,
    };
  }

  get targetPreview() {
    return this.props.selection.preview;
  }

  render() {

    const { selection } = this.props;

    const preview   = selection.preview;
    if (!preview) return null;

    const sections:any = {};

    if (this.targetPreview.moving) {
      sections.guides = (<div>
        <RulerComponent {...this.props} />
        {this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0}
      </div>);
    }

    const allBounds = [];

    selection.forEach(function(entity) {
      entity.flatten().forEach(function(childEntity) {
        if (childEntity.preview) allBounds.push(childEntity.preview);
      });
    });

    const entireBounds = BoundingRect.merge(...allBounds);


    const boundsStyle = {
      position: 'absolute',
      left: entireBounds.left + 1,
      top: entireBounds.top + 1,
      width: entireBounds.width - 1,
      height: entireBounds.height - 1,
    };

    return (<div className='m-selector-component'>
      <ResizerComponent {...this.props} />
      <div className='m-selector-component--bounds' style={boundsStyle} />
      {sections.guides}
      {sections.size}
    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('componentssss/tools/pointer/selector',SelectorComponent);
