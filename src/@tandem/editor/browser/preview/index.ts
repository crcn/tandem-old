import "reflect-metadata";

import { reactPreview } from "@tandem/common";
import "../styles.ts";

export const reactEditorPreview = (render?: () => any) => {
  return reactPreview(render);
}
