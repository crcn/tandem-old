import { Mutation } from "source-mutation";
import { INSERT_HTML_EDIT, INSERT_CHILD_NODE_EDIT, REMOVE_CHILD_NODE_EDIT, MOVE_CHILD_NODE_EDIT } from "./constants";

import { SEnvHTMLElementInterface } from "./html-elements";

export type InsertHTMLMutation<T> = {
  childIndex: number;
  html: string;
} & Mutation<T>;

export const createInsertHTMLMutation = (target: SEnvHTMLElementInterface, childIndex: number, html): InsertHTMLMutation<SEnvHTMLElementInterface> => ({
  type: INSERT_HTML_EDIT,
  html,
  childIndex,
  target
});

