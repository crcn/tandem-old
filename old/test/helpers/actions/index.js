import {
  SetFocusMessage
} from 'editor/message-types';

export function setSelection(app, entities, multiSelect) {
  app.notifier.notify(SetFocusMessage.create(entities, multiSelect));
}