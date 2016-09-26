import { Observable, bindable } from "tandem-common";

export class Location extends Observable {
  @bindable()
  public href: string;

  @bindable()
  public hash: string;

  @bindable()
  public path: string;

  public reload() {

  }
}