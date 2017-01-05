import { Observable, bindable, IPoint } from "@tandem/common";

export class Connection extends Observable {

  @bindable()
  displayName: string;

  @bindable()
  mousePosition: IPoint;
}

