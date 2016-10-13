import {
  Action,
  IRange,
  IActor,
  TreeNode,
  getChunk,
  Observable,
  spliceChunk,
  TreeNodeAction,
  BaseASTNodeLoader,
  PropertyChangeAction,
  calculateIndentation,
  getWhitespaceBeforePosition,
  getIndentationBeforePosition,
} from "@tandem/common";

import {
  WrapBus
} from "mesh";

import {
  repeat
} from "lodash";

import {
  MarkupExpression,
  MarkupTextExpression,
  MarkupNodeExpression,
  MarkupCommentExpression,
  MarkupElementExpression,
  HTMLFragmentExpression,
  MarkupContainerExpression,
  MarkupAttributeExpression,
  IMarkupValueNodeExpression,
} from "./ast";

import {

} from "./utils";

export class MarkupExpressionLoader extends BaseASTNodeLoader {

  parseContent(content: string) {
    // return parse(content);
    return null;
  }

  createFormattedSourceContent(action: Action) {
    let content = this.source.content;

    if (action.type === TreeNodeAction.NODE_ADDED) {

      if (action.target instanceof MarkupAttributeExpression) {
        const target = <MarkupAttributeExpression>action.target;
        const element = <MarkupElementExpression>target.parent;
        const attribs = element.attributes;

        const buffer = [" ", target.name];
        let quoteChar = this.getAttributeQuoteCharacter(target);

        if (target.value) {
          buffer.push(`=`, `${quoteChar}`, target.value, `${quoteChar}`);
        }

        const chunk = buffer.join("");

        const index = attribs.indexOf(action.target);
        const start = (index === 0 ? element.position.start + element.name.length + 1 : attribs[index - 1].position.end);
        const end   = start + chunk.length;
        content = spliceChunk(content, chunk, { start: start, end: start });

      } else if (action.target instanceof MarkupNodeExpression) {
        const target = <MarkupNodeExpression>action.target;
        const parent = <MarkupContainerExpression>target.parent;
        const oldParentChunk = getChunk(content, parent.position);

        // fetch __text in case the target has been detached from the source
        let targetChunk = target["__text"] || (target.source ? getChunk(target.source.content, target.position) : target.toString());
        target["__text"] = undefined;

        const targetIndex = parent.childNodes.indexOf(target);

        let offset    = 0;
        const buffer = [];

        if (targetIndex === 0) {

          let startTag = "";

          if (parent instanceof MarkupElementExpression) {
            offset += oldParentChunk.indexOf(">") + 1;
          }

          // parent is an element, and the only child that exists
          if (parent instanceof MarkupElementExpression && parent.childNodes.length === 1) {
            const element = <MarkupElementExpression>parent;
            buffer.push(oldParentChunk.replace(/(\s+\/>|>[\w\W]*?<\/\w+>)$/, ">"));

            const parentIndentation = getIndentationBeforePosition(content, element.position);

            const indentation = "\n" +

              // copy indentation
              parentIndentation +

              // add doc indentation
              calculateIndentation(content, this.options.indentation);

            offset += indentation.length;

            buffer.push(indentation);

            buffer.push(targetChunk);

            buffer.push("\n", parentIndentation);
            buffer.push(`</${element.name}>`);

          } else {
            buffer.push(spliceChunk(oldParentChunk, targetChunk, {
              start: offset,
              end: offset
            }));
          }

        } else {
          const previousSibling = parent.childNodes[targetIndex - 1];

          offset = previousSibling.position.end - parent.position.start;
          const indentation = getWhitespaceBeforePosition(content, previousSibling.position);

          buffer.push(spliceChunk(oldParentChunk, indentation + targetChunk, {
            start: offset,
            end: offset
          }));

          offset += indentation.length;
        }

        target.position.start = parent.position.start + offset;
        target.position.end   = target.position.start + targetChunk.length;

        content = spliceChunk(content, buffer.join(""), parent.position);
      }
    } else if (action.type === TreeNodeAction.NODE_REMOVED) {

      // TODO - remove whitespace before node
      const chunk = getChunk(content, action.target.position);
      content = spliceChunk(content, "", action.target.position);

      // detached from the AST  -- can't access source anymore
      action.target.__text = chunk;

      // TODO - respect close tag style
    } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      const propertyChangeAction = <PropertyChangeAction>action;

      if (action.target instanceof MarkupAttributeExpression) {
        const target = <MarkupAttributeExpression>action.target;

        if (propertyChangeAction.property === "value") {
          const oldChunk = getChunk(content, target.position);
          let newChunk   = oldChunk;

          // look for attribute without value
          const lookup = target.name + "=";
          const start = oldChunk.indexOf(lookup);

          if (start === -1) {
            const quoteChar = this.getAttributeQuoteCharacter(target);
            newChunk = oldChunk.replace(target.name, [target.name, "=", quoteChar, propertyChangeAction.newValue, quoteChar].join(""));
          } else {
            const s = start + lookup.length + 1;
            newChunk = spliceChunk(oldChunk, propertyChangeAction.newValue, {
              start: s,
              end: s + propertyChangeAction.oldValue.length
            });
          }

          content = spliceChunk(content, newChunk, target.position);
        }
      } else if (action.target instanceof MarkupNodeExpression) {
        const target = <IMarkupValueNodeExpression><any>action.target;
        const currentChunk = getChunk(content, target.position);
        content = spliceChunk(content, currentChunk.replace(propertyChangeAction.oldValue, propertyChangeAction.newValue), target.position);
      }
    }

    return content;
  }

  getDefaultOptions() {
    return {
      indentation: "  "
    };
  }

  private getAttributeQuoteCharacter(target: MarkupAttributeExpression) {
    // simple implementation that just finds one attribute quote in the doc

    const root = target.root;
    // match attribute quote characters in the original element.
    for (const node of flatten(root)) {
      if (!(node instanceof MarkupAttributeExpression) || node === target) continue;
      const attrib = <MarkupAttributeExpression>node;
      const chunk = getChunk(this.source.content, attrib.position);
      const match = chunk.match(/\w+\=(['"])/);
      if (match) {
        return match[1];
      }
    }

    return `"`;
  }
}

function flatten<T extends TreeNode<any>>(node: T): Array<T> {
  const nodes = [node];
  for (const child of node.children) {
    nodes.push(...flatten(child));
  }
  return nodes;
}
