import { 
  bubble,
  bindable,
  Observable,
} from "@tandem/common";

export class MinimapExtensionRootStore extends Observable {
  @bindable()
  public showMinimap: boolean;
}