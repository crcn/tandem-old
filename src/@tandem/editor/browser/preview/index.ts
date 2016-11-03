import "reflect-metadata";

import { reactPreview } from "@tandem/common";
import "../styles.ts";

export const reactEditorPreview = (render) => {
  return reactPreview(render);
}
