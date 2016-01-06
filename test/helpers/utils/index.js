import Editor from 'editor/app';
import { TypeNotifier } from 'common/notifiers';
import { DISPOSE } from 'base/message-types';
import * as mouse from './mouse';

export { mouse };


export async function createApp(config = {}) {

  var div = config.element = document.createElement('div');
  document.body.appendChild(div);

  var app = Editor.create({ testMode: true });
  app.initialize(config);
  // TODO - cleanup here

  app.notifier.push(TypeNotifier.create(DISPOSE, function(message) {
    if (message.target !== app) return;
    document.body.removeChild(div);
  }));

  // wait for rAF
  await timeout(1);

  return app;
}

export function timeout(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  })
}

export async function waitForAllPromises(app) {

  // very dirty, but at least abstracted from tests so things don't get racey.
  // ideally
  return await timeout(100);
}


export function createElementEntity(app, props, children) {
  if (!children) children = [];
  var factory = app.fragments.queryOne({
    id: 'elementEntity'
  }).factory;

  return factory.create(props, children.map(function(child) {
    return createElementEntity(app, props);
  }))
}