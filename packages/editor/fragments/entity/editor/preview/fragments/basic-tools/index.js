import {
  ComponentFragment,
  Fragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import TextTool from './controllers/text';
import PointerTool from './controllers/pointer';
import TextEditTool from './controllers/text-edit';
import { SET_TOOL } from 'editor/message-types';

import TextToolComponent from './components/text';
import ResizerToolComponent from './components/resizer';

export function create({ app }) {

  var pointerTool  = PointerTool.create({ app, notifier: app.notifier });
  var editTextTool = TextEditTool.create({ app, notifier: app.notifier, pointerTool });
  var textTool     = TextTool.create({ app, notifier: app.notifier, editTextTool });

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
      icon    : 'text',
      id      : 'editTextTool',
      type    : 'previewTool',
      tool    : editTextTool,
      matchesQuery({ entity, type }) {
        return type === 'previewTool' && entity && (entity.componentType == 'text');
      }
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
      componentClass : TextToolComponent,
      matchesQuery   : function({ entity, tool }) {
        return entity && tool instanceof TextEditTool;
      }
    }),
    ComponentFragment.create({
      id             : 'resizerToolComponent',
      componentClass : ResizerToolComponent,
      matchesQuery   : function({ tool, entity }) {
        return entity && tool && tool instanceof PointerTool;
      }
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
