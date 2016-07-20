import loggable from 'saffron-common/lib/decorators/loggable';

import { ProxyBus } from 'saffron-common/lib/busses/index';
import BaseApplicationService from 'saffron-common/lib/services/base-application-service';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import * as sift from 'sift';
import IApplication from 'saffron-common/lib/application/interface';

@loggable
export default class ToolService extends BaseApplicationService {

  public toolProxyBus:any;

  constructor(app:IApplication) {
    super(app);
    this.app.actors.push(
      this.toolProxyBus = new ProxyBus(undefined)
    );
    this.setCurrentTool({
      tool: undefined
    });
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

export const fragment = new ClassFactoryFragment('application/services/tool', ToolService);
