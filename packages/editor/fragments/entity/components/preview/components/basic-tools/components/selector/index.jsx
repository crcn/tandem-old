import './index.scss';

import React from 'react';
import EntityGuide from './guides/entity';
import RulerComponent from './ruler';
import GuideComponent from './guide';
import { divideStyle } from 'common/utils/html';
import ResizerComponent from './resizer';
import ObservableObject from 'common/object/observable';
import CallbackNotifier from 'common/notifiers/callback';
import DragSelectComponent from './drag-select';
import SelectablesComponent from './selectables';

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

    var selection = this.props.selection;
    var preview = selection.preview;

    var sections = {};

    if (this.targetPreview.moving && false) {
      sections.guides = <div>
        <RulerComponent {...this.props} bounds={resizerStyle} />
        { this.state.dragBounds ? <GuideComponent {...this.props} bounds={this.state.dragBounds} /> : void 0 }
      </div>;
    }

    if (this.targetPreview.resizing) {
      sections.size = <span  className='m-selector-component--size' style={{
            left: rect.left + rect.width / 2,
            top : rect.top + rect.height
          }}>{Math.round(actStyle.width)} &times; {Math.round(actStyle.height)}</span>;
    }

    return <div className='m-selector-component'>
      <ResizerComponent {...this.props} />
      <DragSelectComponent {...this.props} />
      <SelectablesComponent {...this.props} />
      { sections.guides  }
      { sections.size    }
    </div>;
  }
}

export default SelectorComponent;
