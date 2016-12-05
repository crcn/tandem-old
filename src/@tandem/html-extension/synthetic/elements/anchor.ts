import * as Url from "url";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { bindable, PropertyWatcher } from "@tandem/common";

export class SyntheticAnchor extends SyntheticHTMLElement {

  @bindable()
  public hostname: string;


  @bindable()
  public pathname: string;

  @bindable()
  public port: string;

  @bindable()
  public protocol: string;

  @bindable()
  public hash: string;

  @bindable()
  public search: string;

  private _ignoreRebuild: boolean;

  get host() {
    return this.hostname + (this.port && this.port.length ? ":" + this.port : "");
  }

  set host(value: string) {

    const [hostname, port] = (value || ":").split(":");

    this._ignoreRebuild = true;
    this.hostname = hostname;
    this._ignoreRebuild = false;
    this.port = port;
  }
  
  get href() {
    return this.getAttribute("href");
  }

  set href(value: string) {
    this.setAttribute("href", value);
  }

  createdCallback() {
    super.createdCallback();
    ["hostname", "pathname", "port", "protocol", "hash", "query"].forEach((part) => {
      new PropertyWatcher(this, part).connect(this._rebuildHref);
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "href") {
      this._parseHref();
    }
  }

  private _parseHref() {
    this._ignoreRebuild = true;
    const href = this.href;
    const parts = Url.parse(href);
    for (const key in parts) {
      if (key === "host") continue;
      this[key] = parts[key] || "";
    }
    this._ignoreRebuild = false;
  }

  private _rebuildHref = () => {
    if (this._ignoreRebuild) return;
    this.href = this.protocol + "//" + 
    this.host + 
    this.pathname + this.search + 
    (this.hash && (this.hash.charAt(0) === "#" ? this.hash : "#" + this.hash));
  }
}