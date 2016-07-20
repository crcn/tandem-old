import CoreObject from '../object/index';
import { Action } from '../actions/index';
import { Response } from 'mesh';

export interface IActor {
  execute(action:Action):any;
}

export class BaseActor extends CoreObject implements IActor {
  execute(action:Action) {
  }
}