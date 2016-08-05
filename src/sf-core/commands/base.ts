
import { inject } from "sf-core/decorators";
import { IInjectable } from "sf-core/dependencies";
import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";

export interface ICommand extends IActor { }

export abstract class BaseCommand implements ICommand, IInjectable {
  abstract execute(action: Action);
  didInject() { }
}