import { URIProtocol, IURIProtocolReadResult } from "./protocol";
import http = require("http");
import https = require("https");
import Url = require("url");
import request = require("request");

export class HTTPURIProtocol extends URIProtocol {

  // private _watchers: any = {};
  // private _writes: any = {};


  async read(uri: string): Promise<IURIProtocolReadResult> {
    this.logger.info(`http GET ${uri}`);

    return new Promise<IURIProtocolReadResult>((resolve, reject) => {
      request(uri, { followAllRedirects: true, gzip: true }, (err, response, body) => {
        if (err) return reject(err);

        if (!/^20/.test(String(response.statusCode))) {
          return reject(new Error(`Unable to load: ${response.statusCode}`));
        }

        let contentType = response.headers["content-type"];
        if (contentType) contentType = contentType.split(";").shift();

        resolve({
          type: contentType,
          content: body
        });
      });
  
    });
  }
  async write(uri: string, content: string) {
    // if (this._watchers[uri]) {
    //   this._watchers[uri]();
    // }
  }
  async fileExists(uri: string) {
    // this.logger.info(`Cannot currenty check http 404s`);
    return true;
  }
  watch2(uri: string, onChange: () => any) {
    // this._watchers[uri] = onChange;
    let _disposed: boolean;

    // TODO - actually check for content change from server
    const check = () => {
      if (_disposed) return;
      setTimeout(check, 1000);
    };
    
    check();

    return {
      dispose() {
        _disposed = true;
      }
    }
  }
}