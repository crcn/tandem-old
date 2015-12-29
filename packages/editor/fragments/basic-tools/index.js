import {
  ApplicationFragment,
  PreviewComponentFragment,
  ComponentFragment,
  Fragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import TextTool from './controllers/text';
import TextEditTool from './controllers/text-edit';
import PointerTool from './controllers/pointer';
import { SET_TOOL } from 'editor/message-types';

import TextToolComponent from './components/text';
import RulerToolComponent from './components/ruler';
import ResizerToolComponent from './components/resizer';

export default ApplicationFragment.create({
  id: 'basicTools',
  factory: {
    create: create
  }
});

function create({ app }) {

  var pointerTool  = PointerTool.create({ app, notifier: app.notifier });
  var editTextTool = TextEditTool.create({ app, notifier: app.notifier, pointerTool });
  var textTool     = TextTool.create({ app, notifier: app.notifier, editTextTool });

  app.fragments.push(
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
    })
  );

  // TODO - use TextToolFragment for this stuff here
  app.fragments.push(
    ComponentFragment.create({
      id             : 'textToolComponent',
      componentClass : TextToolComponent,
      matchesQuery   : function({ entity, tool }) {
        return entity && tool instanceof TextEditTool;
      }
    }),
    ComponentFragment.create({
      id             : 'rulerToolComponent',
      componentClass : RulerToolComponent,
      matchesQuery   : function({ entity, tool }) {
        return entity && tool instanceof PointerTool;
      }
    }),
    ComponentFragment.create({
      id             : 'resizerToolComponent',
      componentClass : ResizerToolComponent,
      matchesQuery   : function({ tool, entity }) {
        return entity && tool && tool instanceof PointerTool;
      }
    })
  );
}

function createRedirectNotifier(notifier, message) {
  return {
    notify() {
      return notifier.notify(message);
    }
  }
}
