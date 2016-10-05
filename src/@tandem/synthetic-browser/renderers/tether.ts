import { BaseRenderer } from "./base";
import { IActor } from "@tandem/common/actors";
// import { IActor } from "@tandem/tether/actions";

export class TetherRenderer extends BaseRenderer {
  constructor(readonly bus: IActor) {
    super();
  }

  update() {
    console.log("UPDATE");
  }
}