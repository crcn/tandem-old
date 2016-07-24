import loggable from 'sf-common/decorators/loggable';

import { ProxyBus } from 'sf-common/busses/index';
import BaseApplicationService from 'sf-common/services/base-application-service';
import { ApplicationServiceFragment } from 'sf-common/fragments/index';
import * as sift from 'sift';
import IApplication from 'sf-common/application/interface';

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
