import loggable from 'common/logger/mixins/loggable';

import { ProxyBus } from 'common/busses';
import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import sift from 'sift';

@loggable
export default class ToolService extends Service {

  constructor(properties) {
    super(properties);
    this.app.actors.push(
      this.toolProxyBus = ProxyBus.create()
    );
    this.setCurrentTool({});
  }

  load() {
    const toolFragments = this.app.fragments.queryAll('stage-tools/**');
    const tools = toolFragments.map((toolFragment) => (
      toolFragment.create({ app: this.app, bus: this.bus })
    ));

    this.app.setProperties({
      stageTools: tools
    });

    this.setCurrentTool({
      tool: tools.find(sift({ main: true })) || tools[0]
    });
  }

  setCurrentTool({ tool }) {
    this.app.setProperties({
      currentTool: this.toolProxyBus.target = tool
    });
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/tool',
  factory : ToolService
});
