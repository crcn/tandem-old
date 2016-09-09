import {
  Action,
  IRange,
  IActor,
  TreeNode,
  Observable,
  TreeNodeAction,
  PropertyChangeAction,
} from "tandem-common";

import {
  WrapBus
} from "mesh";

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

export class HTMLASTStringFormatter extends Observable {

  private _expression: HTMLExpression;
  private _expressionObserver: IActor;
  private _content: string;

  constructor(expression?: HTMLExpression) {
    super();
    this._expressionObserver = new WrapBus(this.onExpressionAction.bind(this));
    this.expression = expression;
  }

  get expression(): HTMLExpression {
    return this._expression;
  }

  get content(): string {
    return this._content;
  }

  set expression(value: HTMLExpression) {
    if (this._expression) {
      this._expression.unobserve(this._expressionObserver);
    }

    if (value) {
      if (isExpressionDirty(value, value.source.content)) {
        throw new Error(`The expression loaded differs from its source content.`);
      }
      this._content = value.source.content;
      value.observe(this._expressionObserver);
    }

    this._expression = value;
  }

  private onExpressionAction(action: Action) {
    const oldContent = this._content;

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

        buffer.push("");

        const chunk = buffer.join("");

        const index = attribs.indexOf(action.target);
        const start = (index === 0 ? element.position.start + element.name.length + 1 : attribs[index - 1].position.end);
        const end   = start + chunk.length;
        this._content = spliceChunk(this._content, chunk, { start: start, end: start });

        target.position = { start, end };
        shiftPositionsAfterExpression(target, end - start);
      } else if (action.target instanceof HTMLNodeExpression) {
        const target = <HTMLNodeExpression>action.target;
        const parent = <HTMLContainerExpression>target.parent;
        const oldParentChunk = getChunk(this._content, parent.position);

        // fetch __text in case the target has been detached from the source
        const targetChunk = target["__text"] || getChunk(target.source.content, target.position);
        target["__text"] = undefined;

        const targetIndex = parent.childNodes.indexOf(target);

        let offset    = 0;
        const buffer = [];

        if (targetIndex === 0) {

          let startTag = "";

          if (parent instanceof HTMLElementExpression) {
            offset += oldParentChunk.indexOf(">") + 1;
          }

          if (parent instanceof HTMLElementExpression && parent.childNodes.length === 1) {
            const element = <HTMLElementExpression>parent;
            buffer.push(oldParentChunk.replace(/(\s+\/>|>.*?<\/\w+>)$/, ">"));
            buffer.push(targetChunk);
            buffer.push(`</${element.name}>`);
          } else {

            buffer.push(spliceChunk(oldParentChunk, targetChunk, {
              start: offset,
              end: offset
            }));
          }

        } else {
          offset = parent.childNodes[targetIndex - 1].position.end - parent.position.start;
          buffer.push(spliceChunk(oldParentChunk, targetChunk, {
            start: offset,
            end: offset
          }));
        }

        target.position.start = parent.position.start + offset;
        target.position.end   = target.position.start + targetChunk.length;

        shiftPositionsAfterExpression(target, targetChunk.length);

        this.replaceChunk(parent, buffer.join(""), false, false);
      }
    } else if (action.type === TreeNodeAction.NODE_REMOVING) {
      const chunk = getChunk(this._content, action.target.position);
      this.replaceChunk(action.target, "", false);

      // detached from the AST - doesn't have a source anymore
      // This doesn't belong here.
      action.target.__text = chunk;


      // TODO - respect close tag style
    } else if (action.type === PropertyChangeAction.PROPERTY_CHANGE) {
      if (action.target instanceof HTMLAttributeExpression) {
        const propertyChangeAction = <PropertyChangeAction>action;
        const target = <HTMLAttributeExpression>action.target;

        if (propertyChangeAction.property === "value") {
          const oldChunk = getChunk(this._content, target.position);
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

          this.replaceChunk(target, newChunk);
        }
      }
    }

    if (this._content !== oldContent) {
      this.notify(new PropertyChangeAction("content", this._content, oldContent));
    }
  }

  private replaceChunk(target: HTMLExpression, newChunk: string, offsetTarget: boolean = true, shift: boolean = true) {
    this._content = spliceChunk(this._content, newChunk, target.position);
    const delta = newChunk.length - getChunk(this._content, target.position).length;
    if (offsetTarget) {
      target.position.end += delta;
    }

    if (shift) {
      shiftPositionsAfterExpression(target, delta);
    }
  }

  private getAttributeQuoteCharacter(target: HTMLAttributeExpression) {
    // simple implementation that just finds one attribute quote in the doc

    const root = target.root;
    // match attribute quote characters in the original element.
    for (const node of flatten(root)) {
      if (!(node instanceof HTMLAttributeExpression) || node === target) continue;
      const attrib = <HTMLAttributeExpression>node;
      const chunk = getChunk(this._content, attrib.position);
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

function shiftPositionsAfterExpression(expression: HTMLExpression, delta: number) {

  const parent = expression.parent;

  let currentChild = parent ? parent.firstChild : undefined;

  // order of the children might not always be correct according
  // to the ranges.
  while (currentChild) {

    if (currentChild !== expression) {
      if (currentChild.position.start >= expression.position.start) {
        currentChild.position.start += delta;
        currentChild.position.end += delta;
      }
    }

    currentChild = currentChild.nextSibling;
  }

  if (parent) {
    parent.position.end += delta;
    shiftPositionsAfterExpression(parent, delta);
  }
}

export function spliceChunk(source: string, chunk: string, { start, end }: IRange) {
  return source.substr(0, start) + chunk + source.substr(end);
}

export function isExpressionDirty(expression: HTMLExpression, content: string) {
  let  destContent  = "";
  const srcContent  = <string>content;

  for (const child of flatten(expression)) {
    const { start, end } = child.position;
    if (start === -1 || end === -1) {
      return true;
    }
    destContent = destContent.substr(0, start) + srcContent.substr(start, end - start) + destContent.substr(end);
  }

  return destContent !== srcContent;
}

function flatten<T extends TreeNode<any>>(node: T): Array<T> {
  const nodes = [node];
  for (const child of node.children) {
    nodes.push(...flatten(child));
  }
  return nodes;
}