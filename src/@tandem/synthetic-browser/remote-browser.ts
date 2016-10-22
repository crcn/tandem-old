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
import { FrontEndApplication } from "@tandem/editor";
import { SyntheticWindow, SyntheticDocument, SyntheticDocumentEdit } from "./dom";
import { Bundle, Bundler, BundlerDependency } from "@tandem/sandbox";

const SERIALIZED_DOCUMENT = "serializedDocument";
const DIFFED_DOCUMENT     = "diffedDocument";

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

      const previousDocument = this.window && this.window.document;
      const newDocument      = deserialize(action.data, this._dependencies);

      if (previousDocument) {
        patchTreeNode(previousDocument, newDocument);
      } else {
        const window = new SyntheticWindow(this, this.location, newDocument);
        this.setWindow(window);
      }

      console.info("done loading %s", this.location.toString(), Date.now() - now);
    } else if (action.type === DIFFED_DOCUMENT) {
      const now = Date.now();
      const edit: SyntheticDocumentEdit = deserialize(action.edit, this._dependencies);
      console.log(Date.now() - now);
      console.log("DIFF ", edit);

    }
  }
}

export class RemoteBrowserService extends BaseApplicationService<FrontEndApplication> {
  [OpenRemoteBrowserAction.OPEN_REMOTE_BROWSER](action: OpenRemoteBrowserAction) {

    // TODO - move this to its own class
    return new Response((writer) => {
      const browser = new SyntheticBrowser(this.app.dependencies, new NoopRenderer());
      let currentDocument: SyntheticDocument;

      browser.observe({
        execute(action: Action) {
          if (action.type === SyntheticBrowserAction.BROWSER_LOADED) {

            let edit;

            if (currentDocument) {
               edit = currentDocument.createEdit().addDiff(browser.document);
            }

            // not necessary to clone here since BROWSER_LOADED emits a pristine
            // document each time.
            currentDocument = browser.document;

            if (edit) {

              console.log(serialize(edit));

              if (edit.actions.length) {
                writer.write({ type: DIFFED_DOCUMENT, edit: serialize(edit) });
              }
            } else {
              // TODO - only send diffs here.
              writer.write({ type: SERIALIZED_DOCUMENT, data: serialize(browser.document) });
            }
          }
        }
      });
      browser.open(action.url);
    });
  }
}