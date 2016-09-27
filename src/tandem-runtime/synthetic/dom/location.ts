import { SyntheticObject, SyntheticString, synthetic } from "../core";
import { Browser } from "../../browser";
import * as Url from "url";

export class SyntheticLocation extends SyntheticObject {
  private _urlStr: String;
  constructor(_urlStr: string, browser: Browser) {
    const url = Url.parse(_urlStr);
    super({
      hash: new SyntheticString(url.hash),
      pathname: new SyntheticString(url.hash),
      port: new SyntheticString(url.port),
      hostname: new SyntheticString(url.hostname),
      host: new SyntheticString(url.host),
      href: new SyntheticString(url.href),
      search: new SyntheticString(url.search),
      protocol: new SyntheticString(url.protocol),
    });
    this._urlStr = _urlStr;
  }

  get hash() {
    return this.get("hash") as SyntheticString;
  }

  get pathname() {
    return this.get("pathname") as SyntheticString;
  }

  get port() {
    return this.get("port") as SyntheticString;
  }

  get hostname() {
    return this.get("hostname") as SyntheticString;
  }

  get host() {
    return this.get("host") as SyntheticString;
  }

  get href() {
    return this.get("href") as SyntheticString;
  }

  get protocol() {
    return this.get("protocol") as SyntheticString;
  }

  @synthetic reload() {

  }

  toString() {
    return this._urlStr;
  }
}