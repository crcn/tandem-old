import { NoopRenderer } from "./renderers";
import { ISyntheticBrowser, SyntheticBrowser } from "./browser";
import { OpenRemoteBrowserAction } from "./actions";
import {
  IActor,
  Dependencies,
  MainBusDependency,
  BaseApplicationService
} from "@tandem/common";
import { FrontEndApplication } from "@tandem/editor";

export class RemoteSyntheticBrowser implements ISyntheticBrowser {
  private _bus: IActor;
  constructor(private _dependencies: Dependencies) {
    this._bus = MainBusDependency.getInstance(_dependencies);
  }
  async open(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));
  }
}

export class RemoteBrowserService extends BaseApplicationService<FrontEndApplication> {
  async [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {
    const browser = new SyntheticBrowser(this.app.dependencies, new NoopRenderer());
    await browser.open(action.url);
  }
}