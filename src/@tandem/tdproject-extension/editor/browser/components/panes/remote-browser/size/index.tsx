import  "./index.scss";
import React =  require("react");
import { TextInputComponent } from "@tandem/uikit";
import { BaseApplicationComponent } from "@tandem/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";

export interface IRemoteBrowserPreset {
  label: string;
  width: number;
  height: number;
}

export interface IRemoteBrowserPresetGroup {
  label: string;
  presets: IRemoteBrowserPreset[];
}

const PRESET_GROUPS = [
  {
    label: "iOS",
    presets: [
      {
        label: "iPhone 6/7 Plus",
        width: 414,
        height: 736
      },
      {
        label: "iPhone 6/7",
        width: 375,
        height: 667
      },
      {
        label: "iPhone 5/SE",
        width: 320,
        height: 568
      },
      {
        label: "iPad",
        width: 768,
        height: 1024
      },
      {
        label: "iPad Pro",
        width: 1024,
        height: 1366
      }
    ]
  },

  // // http://www.gravlab.com/2013/11/21/common-android-screen-resolutions-video/
  // {
  //   label: "Android",
  //   presets: [
  //     {
  //       label: "Nexus 7",
  //       width: 1920
  //     }
  //   ]
  // },

  // {
  //   label: "Windows",
  //   presets: [
  //     {
  //       name: 
  //     }
  //   ]
  // },

  // http://www.rapidtables.com/web/dev/screen-resolution-statistics.htm
  {
    label: "Web",
    presets: [
      {
        label: "Web 1920",
        width: 1920,
        height: 1080
      },
      {
        label: "Web 1440",
        width: 1440,
        height: 900
      },
      {
        label: "Web 1024",
        width: 1024,
        height: 768
      }
    ]
  }
];

export class RemoteBrowserPaneSizeComponent extends BaseApplicationComponent<{ workspace, remoteBrowser: SyntheticRemoteBrowserElement }, any> {

  get selectedRemoteBrowser() {
    return this.props.remoteBrowser;
  }

  setStyleProperty = (name: string, value: any) => {
    const remoteBrowser = this.selectedRemoteBrowser;
    remoteBrowser.style[name] = value;
    const edit = remoteBrowser.createEdit();
    edit.setAttribute("style", remoteBrowser.getAttribute("style"));
    this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
  }

  usePreset = (preset: IRemoteBrowserPreset) => {
    const remoteBrowser = this.selectedRemoteBrowser;
    remoteBrowser.style.width = String(preset.width) + "px";
    remoteBrowser.style.height = String(preset.height) + "px";
    const edit = remoteBrowser.createEdit();
    edit.setAttribute("style", remoteBrowser.getAttribute("style"));
    this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
  }

  render() {
    const remoteBrowser = this.selectedRemoteBrowser;
    if (!remoteBrowser) return null;
    
    return <div className="pane remote-browser-pane-size">
      <div className="header">
        Size
      </div>

      <div className="container">
        <div className="row">
          <div className="col-2 label">
            Left
          </div>
          <div className="col-4">
            <TextInputComponent value={remoteBrowser.style.left} onChange={this.setStyleProperty.bind(this, "left")} />
          </div>
          
          <div className="col-2 label">
            Top
          </div>
          <div className="col-4">            
            <TextInputComponent value={remoteBrowser.style.top} onChange={this.setStyleProperty.bind(this, "top")} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Width
          </div>
          <div className="col-4">
            <TextInputComponent value={remoteBrowser.style.width} onChange={this.setStyleProperty.bind(this, "width")} />
          </div>
          
          <div className="col-2 label">
            Height
          </div>
          <div className="col-4">
            <TextInputComponent value={remoteBrowser.style.height} onChange={this.setStyleProperty.bind(this, "height")} />
          </div>
        </div>
      </div>

      <hr />

      { this.renderPresetGroups() }
    </div>
  }

  renderPresetGroups() {
    return <div>
      { PRESET_GROUPS.map(this.renderPresetGroup) }
      <hr />
    </div>; 
  }

  renderPresetGroup = (group: IRemoteBrowserPresetGroup) => {
    return <div className="container preset-group" key={group.label}>
      <div className="row title">
        { group.label }
      </div>
      { group.presets.map(this.renderPreset) }
    </div>
  }


  renderPreset = (preset: IRemoteBrowserPreset) => {
    let scaledWidth, scaledHeight;
    const MAX_SIZE = 15;

    if (preset.width > preset.height) {
      scaledWidth = MAX_SIZE;
      scaledHeight = preset.height * (scaledWidth / preset.width); 
    }

    if (preset.height > preset.width) {
      scaledHeight = MAX_SIZE;
      scaledWidth = preset.width * (scaledHeight / preset.height); 
    }
    

    return <div className="row option" key={preset.label} onClick={this.usePreset.bind(this, preset)}>
      <div className="col-2">
        <div className="preset-preview" style={{width: scaledWidth, height: scaledHeight }} />
      </div>
      <div className="col-6 label name">
        { preset.label }
      </div>
      <div className="col-4 label dims">
        {preset.width} x {preset.height}
      </div>
    </div>
  }
}