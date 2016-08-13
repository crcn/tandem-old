import { Action } from "sf-core/actions";

export const TEXT_EDIT_COMPLETE = "textEditComplete";
export class TextEditCompleteAction extends Action {
  constructor() {
    super(TEXT_EDIT_COMPLETE);
  }
}