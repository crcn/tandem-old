import { NoopRenderer } from "./renderers";
import { OpenRemoteBrowserAction } from "./actions";
import { ISyntheticBrowser, SyntheticBrowser } from "./browser";
import { Response } from "mesh";
import {
  IActor,
  Action,
  serialize,
  deserialize,
  Dependencies,
  MainBusDependency,
  BaseApplicationService
} from "@tandem/common";
import { FrontEndApplication } from "@tandem/editor";

const SERIALIZED_DOCUMENT = "serializedDocument";

export class RemoteSyntheticBrowser implements ISyntheticBrowser {
  private _bus: IActor;
  constructor(private _dependencies: Dependencies) {
    this._bus = MainBusDependency.getInstance(_dependencies);
  }
  async open(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));

    remoteBrowserStream.pipeTo({
      write: this.onRemoteBrowserAction.bind(this),
      close: () => {

      },
      abort: (error) => {

      }
    })
  }

  onRemoteBrowserAction(action: any) {
    if (action.type === SERIALIZED_DOCUMENT) {
      const document = deserialize(action.data);
      console.log(document);
    }
  }
}

export class RemoteBrowserService extends BaseApplicationService<FrontEndApplication> {
  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response(async (writer) => {
      const browser = new SyntheticBrowser(this.app.dependencies, new NoopRenderer());
      await browser.open(action.url);
      writer.write({ type: SERIALIZED_DOCUMENT, data: serialize(browser.document) });
    });
  }
}