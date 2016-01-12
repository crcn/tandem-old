import {
  ComponentFragment,
  Fragment,
  KeyCommandFragment
} from 'editor/fragment/types';

import TextTool from './controllers/text';
import PointerTool from './controllers/pointer';
import TextEditTool from './controllers/text-edit';
import { INITIALIZE } from 'base/message-types';
import { TypeNotifier } from 'common/notifiers';
import { SET_TOOL, GROUP_SELECTION, SET_ROOT_ENTITY } from 'editor/message-types';

import TextToolComponent from './components/text';
import DragSelectComponent from './components/drag-select';
import SelectablesComponent from './components/selectables';
import SelectorToolComponent from './components/selector';

export function create({ app, preview }) {

  var pointerTool  = PointerTool.create({ app, preview, notifier: app.notifier });
  var editTextTool = TextEditTool.create({ app, preview, notifier: app.notifier, pointerTool });
  var textTool     = TextTool.create({ app, notifier: app.notifier, editTextTool });

  app.notifier.push(TypeNotifier.create(INITIALIZE, function() {
    preview.setTool(pointerTool);
  }));

  app.notifier.push(TypeNotifier.create(SET_ROOT_ENTITY, function(message) {
    preview.setLayerFocus(message.entity);
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
      id             : 'dragSelectComponent',
      componentType  : 'tool',
      componentClass : DragSelectComponent,
      matchesQuery(query) {
        return query.toolType === pointerTool.type;
      }
    }),
    ComponentFragment.create({
      id             : 'selectablesComponent',
      componentType  : 'tool',
      componentClass : SelectablesComponent,
      matchesQuery(query) {
        return query.toolType === pointerTool.type;
      }
    }),
    ComponentFragment.create({
      id             : 'selectorToolComponent',
      componentType  : 'tool',
      componentClass : SelectorToolComponent,
      toolType       : pointerTool.type,
      entityType     : 'component'
    })
  ]
}

function createRedirectNotifier(notifier, message) {
  return {
    notify() {
      return notifier.notify(message);
    }
  }
}
