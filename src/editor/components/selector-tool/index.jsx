import './index.scss';

import React from 'react';
import flatten from 'lodash/array/flatten';
import RulerComponent from './ruler';
import GuideComponent from './guide';
import ResizerComponent from './resizer';
import { mergeBoundingRects } from 'common/utils/geom';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

class SelectorComponent extends React.Component {

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

    const sections = {};

    if (this.targetPreview.moving) {
      sections.guides = (<div>
        <RulerComponent {...this.props} />
        {this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0}
      </div>);
    }

    const entireBounds = mergeBoundingRects(flatten(selection.map(function (entity) {
      return entity.flatten().map(function (entity2) {
        return entity2.preview ? entity2.preview.getBoundingRect(true) : void 0;
      });
    })));

    const boundsStyle = {
      position: 'absolute',
      left: entireBounds.left,
      top: entireBounds.top,
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

export default SelectorComponent;

export const fragment = ReactComponentFactoryFragment.create({ 
  ns             : 'components/tools/pointer/selector',
  componentClass : SelectorComponent,
});
