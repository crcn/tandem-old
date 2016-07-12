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

class TextTool extends CoreObject {

  constructor(properties) {
    super(properties);

    // this._routerBus = RouterBus.create({
    //   [STAGE_CANVAS_MOUSE_DOWN]: this._execStageDown.bind(this)
    // });
  }

  execute() {
    
  }
}

export const fragment = [
  ApplicationFragment.create('initTextTool', initTextTool)
]

function initTextTool(app) {

  var tool = new TextTool({ bus: app.bus });

  app.fragmentDictionary.register(
    Fragment.create({
      ns: 'preview/tools/text',
      icon: 'text',
      tool: tool
    })
  );
}
