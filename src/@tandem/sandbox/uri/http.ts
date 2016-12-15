import { URIProtocol, IURIProtocolReadResult } from "./protocol";
import http = require("http");
import https = require("https");
import Url = require("url");

export class HTTPURIProtocol extends URIProtocol {

  // private _watchers: any = {};
  // private _writes: any = {};


  async read(uri: string): Promise<IURIProtocolReadResult> {
    this.logger.info(`http GET ${uri}`);

    return new Promise<IURIProtocolReadResult>((resolve, reject) => {

      const parts = Url.parse(uri);

      const req = uri.indexOf("https:") === 0 ? https.get(parts as any) : http.get(parts);
      const buffer = [];
      req.on("response", (resp) => {
        let contentType = resp.headers["content-type"];
        if (contentType) contentType = contentType.split(";").shift();
        
        // if (this._writes[uri]) {
        //   req.abort();
        //   return {
        //     type: contentType ,
        //     content: this._writes[uri]
        //   };
        // }

        if (/^30/.test(String(resp.statusCode))) {
          return this.read(resp.headers.location).then(resolve, reject);
        }
        
        if (!/^20/.test(String(resp.statusCode))) {
          return reject(new Error(`Unable to load: ${resp.statusCode}`));
        }
        resp.on("data", (chunk) => {
          buffer.push(chunk);
        });

        resp.on("end", () => {
          resolve({
            type: contentType,
            content: buffer.join("")
          });
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