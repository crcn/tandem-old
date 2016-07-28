import {
  FragmentDictionary,
  FacadeFragment,
  BusFragment
} from 'sf-core/fragments';

import { Bus } from "mesh";
import { IApplication } from "sf-core/application";

export class PreviewFacade {
  readonly bus:Bus = BusFragment.getInstance(this.fragments);

  readonly currentTool = {
    cursor: "pointer"
  };

  readonly zoom: number = 1;

  public constructor(readonly fragments:FragmentDictionary) { }

  static getInstance(fragments:FragmentDictionary):PreviewFacade {
    return FacadeFragment.getInstance<PreviewFacade>(fragments, PreviewFacade);
  }
}