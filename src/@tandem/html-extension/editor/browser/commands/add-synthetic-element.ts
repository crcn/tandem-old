import { HTMLExtensionBaseCommand } from "./base";
import { SyntheticDOMElement, SyntheticDOMNode } from "@tandem/synthetic-browser";
import { AddSyntheticObjectRequest, SelectRequest } from "@tandem/editor/browser/messages";
import { ApplyFileEditRequest } from "@tandem/sandbox";


// TODO - do not assume that the selection is a DOM element -- okay for 
// now since it's the only thing that is supported
export class AddSyntheticElementCommand extends HTMLExtensionBaseCommand {
  execute({ item }: AddSyntheticObjectRequest) {
    const selection = (this.editorStore.workspace.selection || []) as SyntheticDOMElement[];
    const highest = selection.length ? selection.reduce((a, b) => {
      return a.depth < b.depth ? a : b;
    }) : undefined;

    const edit = (highest ? highest.parentNode : this.editorStore.workspace.document.body.firstChild as SyntheticDOMElement).createEdit();
    edit.appendChild(item as SyntheticDOMNode);

    this.bus.dispatch(new ApplyFileEditRequest(edit.mutations));
  }
}