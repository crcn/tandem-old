import './index.scss';

import { TemplateComponent, dom, createAttributeBinding, createCallback } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';
import RepeatComponent from 'common/components/repeat';
import { SelectEvent } from 'common/selection/events';
import sift from 'sift';

class SelectableComponent extends TemplateComponent {

  static bindings = {
    'attributes.entity': 'entity',
    'attributes.entity.type': function() {
      console.log('compute');
    }
  };

  static template = <div
    class='m-selectable'
    onclick={createCallback('onClick')}
    style={createAttributeBinding('attributes.entity.preview', function(preview) {
      const { left, top, width, height } = preview.getBoundingRect(true);
      return `left:${left}px; top:${top}px; width:${width}px; height:${height}px`
    })}>
  </div>;

  onClick(event) {
    this.view.application.bus.dispatch(SelectEvent.create(this.attributes.entity, event.metaKey));
  }
}

export default class SelectableToolComponent extends TemplateComponent {
  static template = <div class='m-selectable-tool m-stage-tool'>

    <RepeatComponent each={createAttributeBinding('application.rootEntity', function(entity) {
      return entity.flatten().filter(sift({ type: 'display' }));
    })} as='entity'>
      <SelectableComponent entity={c=>c.entity} />
    </RepeatComponent>
  </div>;
}

export const fragment = ComponentFactoryFragment.create('components/tools/selectable', SelectableToolComponent);
