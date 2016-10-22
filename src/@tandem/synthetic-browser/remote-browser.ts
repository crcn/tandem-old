import { NoopRenderer, ISyntheticDocumentRenderer } from "./renderers";
import { OpenRemoteBrowserAction, SyntheticBrowserAction } from "./actions";
import { ISyntheticBrowser, SyntheticBrowser, BaseSyntheticBrowser } from "./browser";
import { Response } from "mesh";
import {
  fork,
  IActor,
  Action,
  serialize,
  isMaster,
  deserialize,
  Dependencies,
  patchTreeNode,
  MainBusDependency,
  BaseApplicationService
} from "@tandem/common";
import { SyntheticWindow } from "@tandem/synthetic-browser";
import { FrontEndApplication } from "@tandem/editor";
import { Bundle, Bundler, BundlerDependency } from "@tandem/sandbox";

const SERIALIZED_DOCUMENT = "serializedDocument";

export class RemoteSyntheticBrowser extends BaseSyntheticBrowser {
  private _bus: IActor;
  private _bundler: Bundler;
  private _bundle: Bundle;

  constructor(dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser) {
    super(dependencies, renderer, parent);
    this._bus = MainBusDependency.getInstance(dependencies);
    this._bundler = BundlerDependency.getInstance(dependencies);
  }
  async open2(url: string) {
    const remoteBrowserStream = this._bus.execute(new OpenRemoteBrowserAction(url));

    // TODO - new StreamBus(execute(action), onAction)
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
      const now = Date.now();

      const previousDocument = this.window && this.window.document.cloneNode();

      const document = deserialize(action.data, this._dependencies);

      if (previousDocument) {
        patchTreeNode(previousDocument.cloneNode(), document.cloneNode());
      }

      const window = new SyntheticWindow(this, this.location, document);
      this.setWindow(window);
      console.info("done loading %s", this.location.toString(), Date.now() - now);
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

            // TODO - only send diffs here.
            writer.write({ type: SERIALIZED_DOCUMENT, data: serialize(browser.document) });
          }
        }
      });
      browser.open(action.url);
    });
  }
}