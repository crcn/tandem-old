import "reflect-metadata";

import { reactPreview } from "@tandem/common";
import * as React from "react";

@reactPreview()
export class TestComponent extends React.Component<any, any> {
  render() {
    return <div>
      Hello world!!!
    </div>
  }
}