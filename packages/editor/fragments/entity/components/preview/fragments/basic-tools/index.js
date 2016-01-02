import {
  ComponentFragment,
  Fragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import TextTool from './controllers/text';
import PointerTool from './controllers/pointer';
import TextEditTool from './controllers/text-edit';
import { SET_TOOL, GROUP_SELECTION } from 'editor/message-types';
import { INITIALIZE } from 'base/message-types';
import { TypeNotifier } from 'common/notifiers';

import TextToolComponent from './components/text';
import ResizerToolComponent from './components/resizer';

export function create({ app, preview }) {

  var pointerTool  = PointerTool.create({ app, notifier: app.notifier });
  var editTextTool = TextEditTool.create({ app, notifier: app.notifier, pointerTool });
  var textTool     = TextTool.create({ app, notifier: app.notifier, editTextTool });

  app.notifier.push(TypeNotifier.create(INITIALIZE, function() {
    preview.currentTool = pointerTool;
  }));

  return [
    Fragment.create({
      icon    : 'cursor',
      name    : 'pointer tool',
      id      : 'pointerTool',
      type    : 'previewTool',
      tool    : pointerTool
    }),
    Fragment.create({
      icon    : 'text',
      name    : 'text tool',
      id      : 'textTool',
      type    : 'previewTool',
      tool    : textTool
    }),
    Fragment.create({
      id      : 'editTextTool',
      type    : 'previewTool',
      tool    : editTextTool,
      toolType: 'edit',
      entityComponentType: 'text'
    }),
    KeyCommandFragment.create({
      id         : 'textToolKeyCommand',
      keyCommand : 't',
      notifier   : createRedirectNotifier(
        app.notifier,
        { type: SET_TOOL, tool: textTool }
      )
    }),
    KeyCommandFragment.create({
      id         : 'pointerToolKeyCommand',
      keyCommand : 'p',
      notifier   : createRedirectNotifier(
        app.notifier,
        { type: SET_TOOL, tool: pointerTool }
      )
    }),
    ComponentFragment.create({
      id             : 'textToolComponent',
      componentType  : 'tool',
      componentClass : TextToolComponent,
      toolType       : editTextTool.type,
      entityType     : 'component',
      entityComponentType: 'text'
    }),
    ComponentFragment.create({
      id             : 'resizerToolComponent',
      componentType  : 'tool',
      componentClass : ResizerToolComponent,
      toolType       : pointerTool.type,
      entityType     : 'component'
    }),
    ...createNudgeFragments(app)
  ]

}

function createRedirectNotifier(notifier, message) {
  return {
    notify() {
      return notifier.notify(message);
    }
  }
}


function createNudgeFragments(app) {
  return [
    KeyCommandFragment.create({
      id         : 'upKeyCommand',
      keyCommand : 'up',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'downKeyCommand',
      keyCommand : 'down',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'rightKeyCommand',
      keyCommand : 'right',
      notifier   : app.notifier
    }),

    KeyCommandFragment.create({
      id         : 'leftKeyCommand',
      keyCommand : 'left',
      notifier   : app.notifier
    })
  ];
}
