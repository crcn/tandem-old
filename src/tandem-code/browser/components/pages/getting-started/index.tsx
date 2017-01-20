import "./index.scss";

import React = require("react");
import cx = require("classnames");

export class GettingStartedComponent extends React.Component<any, any> {

  private _page: number = window["GET_STARTED_PAGE"] || 0;
  
  nextPage = () => {

  }

  render() {

    const pages = [
      this.renderHello,
      this.renderInstallExtensions,
      // this.howToUse,
      this.done
    ];

    return <div className="getting-started-component">
      <div className="content container">
        {pages[Math.min(this._page, pages.length - 1)]()}
      </div>
      <div className="footer container">
        <div className="row">
          <div className="col-12">
            <a href="#" className="button pull-right" onClick={this.nextPage.bind(this)}>
              { this._page === pages.length -1 ? "Start using tandem" : "Next" }
            </a>
          </div>
        </div>
      </div>
    </div>;
  }

  renderHello = () => {
    return <div>
      <div className="hello row">
        <div className="col-12">
          <div className="logo">
            <img src={require("./icon_black.png")} />
            Tandem

          </div>
          <div className="description">
            Welcome to Tandem! This brief guide will help you get started.
          </div>
        </div>
      </div>
    </div>
  }

  // TODO - auto-detect extension here
  renderInstallExtensions = () => {

    // TODO - should not hard-code here. Okay for MVP.
    const options = [
      {
        label: "Atom",
        iconUrl: require("./atom.png"),
        selected: true
      },
      {
        label: "VSCode",
        iconUrl: require("./vscode.png"),
        selected: false
      },
      {
        label: "None",
        iconUrl: require("./icon_blue.png"),
        
        selected: false
      }
    ];

    return <div className="install-text-editor-extension">
      <div className="row">
        <div className="col-12">
          <div className="title">
            Install a text editor extension
          </div>
          <div className="description">
            Tandem works best with your text editor to synchronize code changes as you're building your application. 
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <ul className="options">
            {
              options.map(({ label, iconUrl, selected }) => {
                return <li className={cx({ selected: selected }, "fill-text")}>
                <img src={iconUrl} />
                <label>{label}</label>
              </li>
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }

  howToUse = () => {
    return <div>
      How to use
    </div>
  }

  done = () => {
    return <div className="done">
      <div className="row">
        <div className="col-12">
          <div className="title">
            
            All done! You can now start using Tandem.

          </div>
        </div>
      </div>
    </div>;
  }
}