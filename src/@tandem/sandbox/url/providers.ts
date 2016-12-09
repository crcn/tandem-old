import { URLProtocol } from "./reader";
import { Injector, createSingletonProviderClass, IProvider } from "@tandem/common";

export class URLProtocolProvider implements IProvider {

  private _value: URLProtocol;
  readonly id: string;
  public owner: Injector;
  readonly overridable: boolean = true;

  constructor(readonly name: string, readonly clazz: { new(): URLProtocol }) {
    this.id = URLProtocolProvider.getId(name);
  }

  static getId(name: string) {
    return ["protocols", name].join("/");
  }

  clone() {
    return new URLProtocolProvider(this.name, this.clazz);
  }

  get value() {
    return this._value || (this._value = this.owner.inject(new this.clazz())); 
  }

  static lookup(url: string, injector: Injector) {

    // no protocol - it's a file
    if (url.indexOf(":") === -1) {
      url = "file://" + url;
    }

    const protocol = url.split(":")[0];

    const provider = injector.query<URLProtocolProvider>(this.getId(protocol));
    return provider && provider.value;
  }
}



