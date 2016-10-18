import { IBundleLoader } from "@tandem/sandbox";

export class TDProjectBundleLoader implements IBundleLoader {
  async load(content: string) {
    console.log("LOAD TD PROJECt");
    return null;
  }
}