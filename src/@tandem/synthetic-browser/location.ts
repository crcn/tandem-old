import { Observable } from "@tandem/common/observable";
import { bindable } from "@tandem/common/decorators";
import Url =  require("url");

export class SyntheticLocation extends Observable {

  @bindable()
  public href: string = "";

  @bindable()
  public hash: string = "";

  @bindable()
  public search: string = "";

  @bindable()
  public pathname: string = "";

  @bindable()
  public port: string = "";

  @bindable()
  public hostname: string = "";

  @bindable()
  public protocol: string = "";

  @bindable()
  public host: string = "";

  constructor(urlStr: string) {
    super();
    const parts = Url.parse(urlStr);
    for (const part in parts) {
      const value = parts[part];
      if (value) this[part] = value;
    };
  }

  toString() {
    return (this.protocol ? this.protocol + "//" : "") +
    (this.host || "") +
    this.pathname;
  }
}