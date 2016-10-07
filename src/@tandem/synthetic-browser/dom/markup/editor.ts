import { SyntheticMarkupNode, SyntheticMarkupElement } from "./index";
import { SyntheticCSSStyleDeclaration } from "../css";
import { ISyntheticEditor, Action, RemoveSyntheticEditAction } from "@tandem/common";

export interface IMarkupElementCapabilities {
  movable: boolean;
  resizable: boolean;
}

class AppendChildEditAction extends Action {
  static readonly APPEND_CHILD = "appendChild";
  constructor(readonly parent: SyntheticMarkupNode, readonly child: SyntheticMarkupNode) {
    super(AppendChildEditAction.APPEND_CHILD);
  }
}

export interface ISyntheticMarkupNodeEditor extends ISyntheticEditor {
  execute(action: RemoveSyntheticEditAction|AppendChildEditAction);
  // remove(node: SyntheticMarkupNode): void;
  // appendChild(parent: SyntheticMarkupNode, child: SyntheticMarkupNode): void;
  // replace(oldChild: SyntheticMarkupNode, newChild: SyntheticMarkupNode): void;
  // setElementAttribute(element: SyntheticMarkupElement, name: string, value: any): void;
  // getElementCapabilities(element: SyntheticMarkupElement): IMarkupElementCapabilities;
}

export function combinedSyntheticElementCapabilities(...elements: SyntheticMarkupElement[]): IMarkupElementCapabilities {
  const capabilities = { movable: true, resizable: true };
  // for (const element of elements) {
  //   const elementCapabilities: IMarkupElementCapabilities = element.editor ? element.editor.getElementCapabilities(element) : {
  //     movable: false,
  //     resizable: false
  //   };

  //   for (const key in elementCapabilities) {
  //     const value = elementCapabilities[key];
  //     capabilities[key] = capabilities[key] && value;
  //   }
  // }
  return capabilities;
}