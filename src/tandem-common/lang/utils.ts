import { IRange } from "tandem-common/geom";
import { TreeNode } from "tandem-common/tree";


export function getStartWhitespace(str: string) {
  const search = /^[\s\r\n\t]+/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

export function getReverseWhitespace(str: string) {
  const search = /[\s\r\n\t]+$/;
  const match  = str.match(search);
  return match ? match[0] : "";
}

export function getWhitespaceBeforePosition(content: string, position: IRange) {
  const match = content.substr(0, position.start).match(/[ \r\n\t]+$/);
  return match ? match[0] : "";
}

export function getIndentationBeforePosition(content: string, position: IRange) {
  return getWhitespaceBeforePosition(content, position).match(/ *$/)[0];
}

export function getSiblingIndentation(content: string, target: TreeNode<any>, filter?: Function): string {

  if (!filter) filter = () => true;

  const parent = target.parent;
  if (parent) {
    for (const child of parent.children) {
      if (child === target || !filter(child)) continue;
      const ws = getWhitespaceBeforePosition(content, child.position);
      if (ws !== "") return ws;
    }
  }
  return this.options.inentation;
}

export function spliceChunk(source: string, chunk: string, { start, end }: IRange) {
  return source.substr(0, start) + chunk + source.substr(end);
}

export function getChunk(content: string, range: IRange) {
  return content.substr(range.start, range.end - range.start);
}
