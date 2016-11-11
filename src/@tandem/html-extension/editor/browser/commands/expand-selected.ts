import { IActor, Action } from "@tandem/common";
import { SyntheticDOMNode, DOMNodeType, SyntheticDocument } from "@tandem/synthetic-browser";
import { SelectionChangeAction } from "@tandem/editor/browser/actions";
import { MetadataKeys } from "@tandem/editor/browser/constants";

export class ExpandSelectedCommand implements IActor {
  execute({ items }: SelectionChangeAction) {

    const expand = (node: SyntheticDOMNode) => {
      for (const ancestor of [node, ...node.ancestors]) {
        ancestor.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
        if (ancestor.nodeType === DOMNodeType.DOCUMENT && (<SyntheticDocument>ancestor).ownerNode) {
          expand((<SyntheticDocument>ancestor).ownerNode);
        }
      }
    }

    for (const item of items) {
      if (item.nodeType) {
        const node = <SyntheticDOMNode>item;
        expand(node);
      }
    }
  }
}