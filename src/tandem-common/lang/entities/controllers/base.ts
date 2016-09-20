import { BaseEntity } from "../index";

export interface IEntityController {
  evaluate(context: any);
}

export abstract class BaseEntityController implements IEntityController {
  constructor(readonly entity: BaseEntity<any>) {

  }
  abstract evaluate(context: any);
}