import { BaseExpression, ICursorPosition, flattenEach } from '../core/expression';

export const HTML_FRAGMENT = 'htmlFragment';
export class HTMLFragmentExpression extends BaseExpression {
  constructor(public childNodes:Array<HTMLExpression>, position:ICursorPosition) {
    super(HTML_FRAGMENT, position);
  }
  
  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.childNodes, items);
  }

  public toString() {
    return this.childNodes.join('');
  }
}

export abstract class HTMLExpression extends BaseExpression { }

/**
 * HTML
 */

export const HTML_ELEMENT = 'htmlElement';
export class HTMLElementExpression extends HTMLExpression {
  constructor(
    public nodeName:string,
    public attributes:Array<HTMLAttributeExpression>,
    public childNodes:Array<HTMLExpression>,
    public position:ICursorPosition) {
    super(HTML_ELEMENT, position);
  }

  public _flattenDeep(items) {
    super._flattenDeep(items);
    flattenEach(this.attributes, items);
    flattenEach(this.childNodes, items);
  }

  public toString() {
    var buffer = ['<', this.nodeName];
    for (var attribute of this.attributes) {
      buffer.push(' ', attribute.toString());
    }
    if (this.childNodes.length) {
      buffer.push('>');
      for (var child of this.childNodes) {
        buffer.push(child.toString());
      }
      buffer.push('</', this.nodeName, '>');
    } else {
      buffer.push('/>');
    }
    return buffer.join('');
  }
}

export const HTML_ATTRIBUTE = 'htmlAttribute';
export class HTMLAttributeExpression extends BaseExpression {
  constructor(public key:string, public value:string, position:ICursorPosition) {
    super(HTML_ATTRIBUTE, position);
  }
  toString() {
    var buffer = [this.key];
    var value = this.value;
    if (value !== '""') {
      buffer.push('=', value);
    }
    return buffer.join('');
  }
}

export const HTML_TEXT = 'htmlText';
export class HTMLTextExpression extends HTMLExpression {
  constructor(public nodeValue:string, public position:ICursorPosition) {
    super(HTML_TEXT, position);
  }
  toString() {

    // only WS - trim
    if (/^[\s\n\t\r]+$/.test(this.nodeValue)) return '';
    return this.nodeValue.trim();
  }
}

export const HTML_COMMENT = 'htmlComment';
export class HTMLCommentExpression extends HTMLExpression {
  constructor(public nodeValue:string, public position:ICursorPosition) {
    super(HTML_COMMENT, position);
  }

  toString() {
    return ['<!--', this.nodeValue, '-->'].join('');
  }
}

// export const HTML_BLOCK = 'htmlBlock';
// export class HTMLBlockExpression extends HTMLExpression {
//   constructor(public script:BaseExpression, public position:ICursorPosition) {
//     super(HTML_BLOCK, position);
//   }
//   public _flattenDeep(items) {
//     super._flattenDeep(items);
//     this.script._flattenDeep(items);
//   }
// }


