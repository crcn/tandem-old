import "./index.scss";

import * as React from "react";

export class GettingStartedComponent extends React.Component<any, any> {

  private _page: number = window["GET_STARTED_PAGE"] || 0;
  
  nextPage = () => {

  }

  render() {

    const pages = [
      this.renderHello,
      this.renderInstallExtensions,
      this.howToUse
    ];

    return <div className="getting-started-component">
      <div className="content container">
        {pages[Math.min(this._page, pages.length - 1)]()}
      </div>
      <div className="footer container">
        <div className="row">
          <div className="col-12">
            <a href="#" className="button pull-right" onClick={this.nextPage.bind(this)}>
              Next
            </a>
          </div>
        </div>
      </div>
    </div>;
  }

  renderHello = () => {
    return <div>
      <div className="hello row">
        <div className="logo">
          <img src={require("./icon_black.png")} />
          Tandem
        </div>

        <div className="description">
          Welcome to Tandem. This brief guide will help set you up so that you get the most of the
          the application.
        </div>
      </div>
    </div>
  }

  renderInstallExtensions = () => {
    return <div>
      Install extensions
    </div>
  }

  howToUse = () => {
    return <div>
      How to use
    </div>
  }
}