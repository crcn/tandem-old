import { URIProtocol } from "@tandem/sandbox";
import { IEditorCommonConfig } from "@tandem/editor/common";
import { inject, ApplicationConfigurationProvider } from "@tandem/common";

export class HTTPProxyProtocol extends URIProtocol {

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorCommonConfig;

  async fileExists(uri: string) {
    return (await this.get("file-exists", uri)).content === "true";
  }

  async read(uri: string) {
    return await this.get("read", uri);
  }

  async write(uri: string, content: string|Buffer) {
    const data = new FormData();
    data.append("text", content as any);
    // console.log(content)
    return await this.post("write", uri, content);
  }

  protected watch2(uri: string, callback: () => any) {
    return {
      dispose() { 
      }
    }
  }

  private async post(method: string, uri: string, data: FormData|string|Buffer) {
    return this.fetch( method, uri, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;"
      },
      body: data
    });
  }

  private async get(method: string, uri: string) {
    return this.fetch(method, uri, {
      method: "GET"
    });
  }

  private async fetch(name: string, uri: string, init: RequestInit) {
    const result = await fetch(this.getProxyUri(name, uri), init);
    return { type: (result.headers.get("content-type") || "text/plain").split(";")[0], content: await result.text() }
  }

  private getProxyUri(name: string, uri: string) {
    return `${this._config.server.protocol}//${this._config.server.hostname}:${this._config.server.port}/proxy/${name}/${new Buffer("cache://" + new Buffer(uri).toString("base64")).toString("base64")}`;
  }

}