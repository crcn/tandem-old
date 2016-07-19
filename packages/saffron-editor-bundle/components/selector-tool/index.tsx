import './index.scss';

import * as React from 'react';
import { flatten } from 'lodash';
import RulerComponent from './ruler/index';
import GuideComponent from './guide/index';
import ResizerComponent from './resizer/index';
import { mergeBoundingRects } from 'saffron-common/lib/utils/geom/index';
import { ReactComponentFactoryFragment } from 'saffron-common/lib/react/fragments/index';

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

    const entireBounds = mergeBoundingRects(flatten(selection.map(function (entity) {
      return entity.flatten().map(function (entity2) {
        return entity2.preview ? entity2.preview.getBoundingRect(true) : void 0;
      });
    })) as any);

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

export const fragment = new ReactComponentFactoryFragment({
  ns             : 'components/tools/pointer/selector',
  componentClass : SelectorComponent,
});
