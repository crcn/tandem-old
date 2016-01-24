import './index.scss';

import React from 'react';
import flatten from 'lodash/array/flatten';
import EntityGuide from './guides/entity';
import RulerComponent from './ruler';
import GuideComponent from './guide';
import { divideStyle } from 'common/utils/html';
import ResizerComponent from './resizer';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';
import { calculateBoundingRect } from 'common/utils/geom';

import { ENTITY_PREVIEW_DOUBLE_CLICK } from 'editor/message-types';

const PADDING            = 6;
const SNAP_MARGIN        = 5;


class SelectorComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      moving: false
    };
  }

  get targetPreview() {
    return this.props.selection.preview;
  }

  render() {

    if (this.props.app.preview.currentTool.type !== 'pointer') return null;

    var selection = this.props.selection;
    var preview   = selection.preview;
    if (!preview) return null;

    var sections = {};

    if (this.targetPreview.moving) {
      sections.guides = <div>
        <RulerComponent {...this.props} />
        { this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0 }
      </div>;
    }

    if (this.targetPreview.resizing) {
      sections.size = <span  className='m-selector-component--size' style={{
            left: rect.left + rect.width / 2,
            top : rect.top + rect.height
          }}>{Math.round(actStyle.width)} &times; {Math.round(actStyle.height)}</span>;
    }


    var entireBounds = calculateBoundingRect(flatten(selection.map(function(entity) {
      return entity.flatten().map(function(entity) {
        return entity.preview.getBoundingRect(true);
      });
    })));

    var boundsStyle = {
      position: 'absolute',
      left: entireBounds.left + 1,
      top: entireBounds.top + 1,
      width: entireBounds.width,
      height: entireBounds.height
    };


    return <div className='m-selector-component'>
      <ResizerComponent {...this.props} />
      <div className='m-selector-component--bounds' style={boundsStyle} />
      { sections.guides  }
      { sections.size    }
    </div>;
  }
}

export default SelectorComponent;
