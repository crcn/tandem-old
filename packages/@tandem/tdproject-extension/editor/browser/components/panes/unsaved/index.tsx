import "./index.scss";
import path = require("path");
import React = require("react");
import { FileCacheItem } from "@tandem/sandbox";
import { BaseApplicationComponent, inject } from "@tandem/common";
import { OpenFileRequest, SaveAllRequest } from "@tandem/editor/browser";
import { TDProjectExtensionStore } from "@tandem/tdproject-extension/editor/browser/stores";
import { TandemExtensionStoreProvider } from "@tandem/tdproject-extension/editor/browser/providers";

export class UnsavedFileComponent extends BaseApplicationComponent<{ item: FileCacheItem }, any> {

  onClick = () => {
    this.bus.dispatch(new OpenFileRequest(this.props.item.sourceUri));
  }

  render() {
    const { item } = this.props;
    return <div className="row unsaved-file" onClick={this.onClick}>
      <div className="col-12">
        <span className="file-basename">{ path.basename(item.sourceUri) }</span>
        <span className="file-dirname">{ path.dirname(item.sourceUri) }</span>
      </div> 
      <div className="col-2 hide">
        <i className="difference-button ion-ios-photos-outline" />
      </div> 
    </div>
  }
}


export class UnsavedFilesPaneComponent extends BaseApplicationComponent<any, any> {
  @inject(TandemExtensionStoreProvider.ID)
  private _store: TDProjectExtensionStore;

  saveAll = () => {
    this.bus.dispatch(new SaveAllRequest());
  }

  render() {
    if (!this._store.unsavedFiles.length) return null;
    return <div className="pane unsaved-files-pane">
      <div className="header">
        Unsaved Files
        <div className="controls">
          <i className="save-all-button glyphicon glyphicon-floppy-disk" title="save all" onClick={this.saveAll} />
        </div>
      </div>
      <div className="container">
          {
            this._store.unsavedFiles.map((item, index) => {
              return <UnsavedFileComponent item={item} key={index} />
            })
          }
      </div>
    </div>
  }
}