import {
  STAGE_CANVAS_MOUSE_DOWN,
  ENTITY_PREVIEW_DOUBLE_CLICK,
  GROUP_SELECTION,
  SetFocusMessage,
  SetToolMessage
} from 'editor-fragment/events';

import { SelectEvent } from 'editor-fragment/selection/events';
import { Fragment } from 'common/fragments';
import { ReactComponentFactoryFragment } from 'common/react/fragments';
import { ApplicationFragment } from 'common/application/fragments';
import { TypeCallbackBus, RouterBus } from 'common/mesh';
import { INITIALIZE } from 'common/application/events';
import CoreObject from 'common/object';

class PointerTool extends CoreObject {

  name = 'pointer';

  constructor(properties) {
    super(properties);

    this._routerBus = RouterBus.create({
      [STAGE_CANVAS_MOUSE_DOWN]: this._execStageDown.bind(this)
    });
  }

  execute(event) {
    this._routerBus.execute(event);
  }

  _execStageDown(event) {
    this.bus.execute(SelectEvent.create());
  }
}

export const fragment = [
  ApplicationFragment.create('initPointerTool', initPointer)
]

function initPointer(app) {

  var tool = new PointerTool({ bus: app.bus });

  app.fragmentDictionary.register(
    Fragment.create({
      ns: 'preview/tools/pointer',
      icon: 'cursor',
      tool: tool
    })
  );

  app.busses.push(
    TypeCallbackBus.create(INITIALIZE, onInitialize)
  );

  function onInitialize() {
    app.bus.execute({ type: 'setCurrentTool', tool: tool })
  }
}
