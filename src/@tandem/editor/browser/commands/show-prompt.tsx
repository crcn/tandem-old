import * as React from "react";
import { PromptComponent } from "../components";
import { ShowPromptRequest } from "../messages";
import { BaseEditorBrowserCommand } from "./base";

export class ShowPromptCommand extends BaseEditorBrowserCommand {
  execute({ render, closeable }: ShowPromptRequest) {

    const renderPrompt = (props) => {
      return <PromptComponent {...props} closeable={closeable} render={render} onClose={() => {
        const index = this.editorStore.popups.indexOf(renderPrompt)
        if (~index) this.editorStore.popups.splice(index, 1);
      }} />
    };

    this.editorStore.popups.push(renderPrompt);
  }
}