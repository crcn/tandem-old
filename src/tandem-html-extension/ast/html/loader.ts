import {
  Action,
  IRange,
  IActor,
  TreeNode,
  Observable,
  TreeNodeAction,
  BaseExpressionLoader,
  PropertyChangeAction,
} from "tandem-common";

import {
  WrapBus
} from "mesh";

import {
  parse
} from "./parser.peg";

import {
  repeat
} from "lodash";

import {
  HTMLExpression,
  HTMLTextExpression,
  HTMLNodeExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLContainerExpression,
  HTMLAttributeExpression,
} from "./expressions";

export class HTMLExpressionLoader extends BaseExpressionLoader {

  parseContent(content: string) {
    return parse(content);
  }

  createFormattedSourceContent(action: Action) {
    let content = this.source.content;

    if (action.type === TreeNodeAction.NODE_ADDED) {

      if (action.target instanceof HTMLAttributeExpression) {
        const target = <HTMLAttributeExpression>action.target;
        const element = <HTMLElementExpression>target.parent;
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

      } else if (action.target instanceof HTMLNodeExpression) {
        const target = <HTMLNodeExpression>action.target;
        const parent = <HTMLContainerExpression>target.parent;
        const oldParentChunk = getChunk(content, parent.position);

        // fetch __text in case the target has been detached from the source
        let targetChunk = target["__text"] || (target.source ? getChunk(target.source.content, target.position) : target.toString());
        target["__text"] = undefined;

        const targetIndex = parent.childNodes.indexOf(target);

        let offset    = 0;
        const buffer = [];

        if (targetIndex === 0) {

          let startTag = "";

          if (parent instanceof HTMLElementExpression) {
            offset += oldParentChunk.indexOf(">") + 1;
          }

          // parent is an element, and the only child that exists
          if (parent instanceof HTMLElementExpression && parent.childNodes.length === 1) {
            const element = <HTMLElementExpression>parent;
            buffer.push(oldParentChunk.replace(/(\s+\/>|>[\w\W]*?<\/\w+>)$/, ">"));

            const parentIndentation = this.getIndentationBeforePosition(element.position);

            const indentation = "\n" +

              // copy indentation
              parentIndentation +

              // add doc indentation
              this.calculateIndentation();

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
          const indentation = this.getWhitespaceBeforePosition(previousSibling.position);

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
      const chunk = getChunk(content, action.target.position);
      content = spliceChunk(content, "", action.target.position);

      // detached from the AST  -- can't access source anymore
      action.target.__text = chunk;

      // TODO - respect close tag style
    } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      if (action.target instanceof HTMLAttributeExpression) {
        const propertyChangeAction = <PropertyChangeAction>action;
        const target = <HTMLAttributeExpression>action.target;

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
      }
    }

    return content;
  }

  private calculateIndentation(): string {
    const lines = this.source.content.split(/\n+/g);

    // go with the first line with whitespace before it -- use
    // that as indentation.
    for (let i = 0, n = lines.length; i < n; i++) {
      const cline  = lines[i];
      const clinews = cline.match(/[\t\s]*/)[0];
      if (clinews.length) return clinews;
    }

    return this.options.indentation;
  }

  private getSiblingIndentation(target: HTMLNodeExpression): string {

    const parent = <HTMLContainerExpression>target.parent;
    if (parent) {
      for (const child of parent.childNodes) {
        if (child === target) continue;
        const ws = this.getWhitespaceBeforePosition(child.position);
        if (ws !== "") return ws;
      }
    }
    return this.options.inentation;
  }

  getDefaultOptions() {
    return {
      indentation: "  "
    };
  }

  private getWhitespaceBeforePosition(position: IRange) {
    const match = this.source.content.substr(0, position.start).match(/[ \r\n\t]+$/);
    return match ? match[0] : "";
  }
  private getIndentationBeforePosition(position: IRange) {
    return this.getWhitespaceBeforePosition(position).match(/ *$/)[0];
  }

  private getAttributeQuoteCharacter(target: HTMLAttributeExpression) {
    // simple implementation that just finds one attribute quote in the doc

    const root = target.root;
    // match attribute quote characters in the original element.
    for (const node of flatten(root)) {
      if (!(node instanceof HTMLAttributeExpression) || node === target) continue;
      const attrib = <HTMLAttributeExpression>node;
      const chunk = getChunk(this.source.content, attrib.position);
      const match = chunk.match(/\w+\=(['"])/);
      if (match) {
        return match[1];
      }
    }

    return `"`;
  }
}


function getChunk(content: string, range: IRange) {
  return content.substr(range.start, range.end - range.start);
}

export function spliceChunk(source: string, chunk: string, { start, end }: IRange) {
  return source.substr(0, start) + chunk + source.substr(end);
}

function flatten<T extends TreeNode<any>>(node: T): Array<T> {
  const nodes = [node];
  for (const child of node.children) {
    nodes.push(...flatten(child));
  }
  return nodes;
}
