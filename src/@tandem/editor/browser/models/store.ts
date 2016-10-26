import {
  bubble,
  Metadata,
  bindable,
  Observable
} from "@tandem/common";

import { Workspace } from "./workspace";

// TODO: add workspaces
export class Store extends Observable {

  @bindable()
  @bubble()
  readonly settings = new Metadata();

  @bindable()
  @bubble()
  public workspace: Workspace;
}