import { Observable, bindable } from "@tandem/common";
import { FileCacheItem } from "@tandem/sandbox";

export class TDProjectExtensionStore extends Observable {

  @bindable()
  public unsavedFiles: FileCacheItem[] = [];

  
} 