import {
  FragmentDictionary,
  FacadeFragment,
  BusFragment
} from 'sf-core/fragments';

import { Bus } from "mesh";
import { IApplication } from "sf-core/application";
import { Observable } from "sf-core/observable";
import { bindable } from "sf-core/decorators";

export class PreviewFacade extends Observable {
  readonly bus:Bus = BusFragment.getInstance(this.fragments);

  @bindable()
  readonly currentTool = {
    cursor: "pointer"
  };

  @bindable()
  readonly zoom: number = 1;

  public constructor(readonly fragments:FragmentDictionary) {
    super();

    // all changes and the facade flows through the bus
    this.observe(this.bus);
  }

  static getInstance(fragments:FragmentDictionary):PreviewFacade {
    return FacadeFragment.getInstance<PreviewFacade>(fragments, PreviewFacade);
  }
}