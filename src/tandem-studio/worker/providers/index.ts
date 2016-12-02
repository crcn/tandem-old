
import { Provider } from "@tandem/common";
import { IDispatcher } from "@tandem/mesh";


export class DSProvider extends Provider<IDispatcher<any, any>> {
  static readonly ID: string = "ds";
  constructor(value: IDispatcher<any, any>) {
    super(DSProvider.ID, value);
  }
}
