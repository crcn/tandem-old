import { bindable, bubble, Observable, ApplicationConfigurationProvider, inject } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { IStudioEditorServerConfig } from "../config";
import fs = require("fs");
import path = require("path");
import { IUserSettings } from "tandem-code/common";

export class UserSettings implements IUserSettings {

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IStudioEditorServerConfig;

  public textEditor: {
    bin: string;
    args?: any[];
  }

  constructor(readonly sourceData: IUserSettings) {
    this.deserialize(sourceData);
  }

  deserialize({ textEditor }: IUserSettings) {
    this.textEditor = textEditor;
    return this;
  }

  serialize(): IUserSettings {
    return {
      textEditor: this.textEditor
    };
  }

  get filePath() {
    return path.join(this._config.settingsDirectory, "/config.json");
  }

  async save() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(this.serialize(), null, 2), (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async exists() {
    return new Promise((resolve, reject) => {
      fs.exists(this.filePath, resolve);
    }); 
  }
}

export class TandemStudioMasterStore extends Observable {
  @bindable(true)
  public userSettings: UserSettings;

  @bindable(true)
  public tunnelUrl: string;
}