import "./index.scss";
import React = require("react");
import cx = require("classnames");
import { CodeMirrorComponent } from "tandem-playground/browser/components/common";
import { UpdateFileCacheRequest } from "tandem-playground/browser/messages";
import { RootPlaygroundBrowserStore } from "tandem-playground/browser/stores";
import { PlaygroundBrowserStoreProvider } from "tandem-playground/browser/providers";
import { BaseApplicationComponent, inject } from "@tandem/common";

export class TextEditorComponent extends BaseApplicationComponent<any, any> {

  @inject(PlaygroundBrowserStoreProvider.ID)
  private _store: RootPlaygroundBrowserStore;
  private _updating: boolean;
  private _shouldUpdateAgainContent: string;


  state = {
    showTextEditor: undefined
  };

  onChange = async (value: string) => {
    if (this._updating) {
      this._shouldUpdateAgainContent = value;
      return;
    }
    const uri = this._store.textEditor.currentFile.uri;
    if (!uri || this._store.textEditor.currentFile.content === value) return;

    this._updating = true;
    await this.bus.dispatch(new UpdateFileCacheRequest(uri, value));
    this._updating = false;
    if (this._shouldUpdateAgainContent) {
      this.onChange(this._shouldUpdateAgainContent);
    }
  }

  toggleTextEditor = () => {
    this._store.textEditor.show = !this._store.textEditor.show;
  }

  render() {
    let { show, currentFile } = this._store.textEditor;

    if (!currentFile.uri && show) show = false;

    return <div className={cx({ show: show, "no-show": show === false }, "text-editor-component")}>
      <div className="header">
        <div className="row">
          <i className={cx({ selected: show, disable: !currentFile.uri }, "ion-code fill-text")} onClick={currentFile.uri ? this.toggleTextEditor : undefined} />
        </div>
      </div>
      <div className="text">
        <div className="mute-overlay" style={{ display: show ? "none" : "block" }} onClick={this.toggleTextEditor} />
        <CodeMirrorComponent onChange={this.onChange} value={String(currentFile.content)} contentType={currentFile.type} />
      </div>

      <div className="footer">
        &nbsp;
      </div>
    </div>
  }
}