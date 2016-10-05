import { Observable } from "@tandem/common/observable";
import { bindable } from "@tandem/common/decorators";
import * as Url from "url";

export class SyntheticLocation extends Observable {

  @bindable()
  public href: string;

  @bindable()
  public hash: string;

  @bindable()
  public search: string;

  @bindable()
  public pathname: string;

  @bindable()
  public port: string;

  @bindable()
  public hostname: string;

  @bindable()
  public protocol: string;

  @bindable()
  public host: string;

  constructor(urlStr: string) {
    super();
    Object.assign(this, Url.parse(urlStr));
  }
}