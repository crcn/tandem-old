import './index.scss';

import { TemplateComponent, dom, createAttributeBinding } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';
import RepeatComponent from 'common/components/repeat';
import { SelectEvent } from 'editor-fragment/events';

// TODO onclick={create}
class SelectableComponent extends TemplateComponent {

  static template = <div class='m-selectable' onclick={(event, { context })=>context.onClick(event)}>
    Node name: { c=>c.attributes.entity.type }
  </div>;

  onClick(event) {
    console.log(this.attributes.entity);
    this.view.application.bus.dispatch(SelectEvent.create(this.attributes.entity))
  }
}

export default class SelectableToolComponent extends TemplateComponent {
  static template = <div class='m-selectable-tool'>

    <RepeatComponent each={createAttributeBinding('application.rootEntity', function(entity) {
      return entity.flatten();
    })} as='entity'>
      <SelectableComponent entity={c=>c.entity} />
    </RepeatComponent>
  </div>;
}

export const fragment = ComponentFactoryFragment.create('components/tools/selectable', SelectableToolComponent);
