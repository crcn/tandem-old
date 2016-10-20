import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserAction, SyntheticBrowserAction } from "./actions";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser } from "./browser";
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
import { SyntheticWindow } from "@tandem/synthetic-browser";

const SERIALIZED_DOCUMENT = "serializedDocument";

export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {
  private _bus: IActor;
  constructor(dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(dependencies, renderer, parent);
    this._bus = MainBusDependency.getInstance(dependencies);
  }
  async open2(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));

    remoteBrowserStream.pipeTo({
      write: this.onRemoteBrowserAction.bind(this),
      close: () => {
        console.log("closed!");
      },
      abort: (error) => {

      }
    })
  }

  onRemoteBrowserAction(action: any) {
    if (action.type === SERIALIZED_DOCUMENT) {
      this.setWindow(new SyntheticWindow(this, this.location, deserialize(action.data, this._dependencies)));
    }
  }
}

export class RemoteBrowserService extends BaseApplicationService<FrontEndApplication> {
  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response((writer) => {
      const browser = new SyntheticBrowser(this.app.dependencies, new NoopRenderer());
      browser.observe({
        execute(action: Action) {
          if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {
            writer.write({ type: SERIALIZED_DOCUMENT, data: serialize(browser.document) });
          }
        }
      });
      browser.open(action.url);
    });
  }
}