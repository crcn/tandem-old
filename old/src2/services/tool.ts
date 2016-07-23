import loggable from 'saffron-common/src/decorators/loggable';

import { ProxyBus } from 'saffron-common/src/busses/index';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import * as sift from 'sift';
import IApplication from 'saffron-common/src/application/interface';

@loggable
export default class ToolService extends BaseApplicationService<IApplication> {

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
    const toolFragments = this.app.fragments.queryAll<ApplicationServiceFragment>('stage-tools/**');
    const tools = toolFragments.map((toolFragment:ApplicationServiceFragment) => (
      toolFragment.create(this.app)
    ));

    (this.app as any).setProperties({
      stageTools: tools
    });

    this.setCurrentTool({
      tool: tools.find(sift({ main: true })) || tools[0]
    });
  }

  setCurrentTool({ tool }) {
    (this.app as any).setProperties({
      currentTool: this.toolProxyBus.target = tool
    });
  }
}

export const fragment = new ApplicationServiceFragment('application/services/tool', ToolService);
