import {
  MarkupNodeExpression,
  MarkupExpression
} from "./ast";

import { repeat } from "lodash";


export function formatMarkupExpression(node: MarkupNodeExpression, defaultIndentation: string = "  "): string {

  const indentation = defaultIndentation;

  function format(current: MarkupExpression, level: number = 0) {

    function indent() {
      return repeat(indentation, level);
    }

    return current.accept({
      visitAttribute(attribute) {
        return ` ${attribute.name}="${attribute.value}"`;
      },
      visitElement(element) {
        let buffer = indent() + `<${element.nodeName}${element.attributes.map((attribute) => format(attribute)).join("")}>`;

        if (element.childNodes.length) {
          buffer += "\n" + element.childNodes.map((child) => format(child, level + 1)).join("\n") + "\n" + indent();
        }

        buffer += `</${element.nodeName}>`;
        return buffer;
      },
      visitComment(comment) {
        return indent() + `<!--${comment.nodeValue}-->`;
      },
      visitDocumentFragment(fragment) {
        return fragment.childNodes.map((child) => format(child, level)).join("\n");
      },
      visitText(text) {
        return indent() + text.nodeValue.trim();
      }
    });
  }

  return format(node, 0);
}