

import { default as rootComponentFragment } from './fragments/render-root-component/index';
import BaseApplication from 'common/application/base';
import editorFragment from 'editor-fragments/index';

function observable() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target, propertyKey, descriptor);
    // target[propertyKey]
  }
}

export default class BrowserApplication extends BaseApplication {

  constructor(properties = {}) {
    super(properties, [
      editorFragment,
      rootComponentFragment
    ]);
  }
}
