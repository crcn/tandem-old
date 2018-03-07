import * as React from "react";
import { EditorComponent } from "./editor";

const RootBaseComponent = () => <div className="m-root">
  <EditorComponent />
</div>;

export const RootComponent = EditorComponent;