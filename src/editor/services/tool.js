import loggable from 'common/logger/mixins/loggable';

import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class ToolService extends Service {

  constructor(properties) {
    super(properties);

    this.app.currentTool = {};
  }

  setCurrentTool() {

  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/actors/tool',
  factory : ToolService
});
