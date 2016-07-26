import { parse as parseHTML } from 'saffron-html-extension/parser';

const expression = parseHTML('<div></div>');

abstract class DOMEntity extends Element {

  readonly section:IMarkupSection;

  constructor(nodeName, fragments) {
    super(nodeName, fragments);
  }

  didMount() {
    const p = this.parentNode;
    while (!(p instanceof DOMEntity)) {
      p = p.parentNode;
    }
    p.section.appendChild(this.section || (this.section = this.createSection()).toFragment());
  }

  abstract protected createSection();
}

class Repeat extends DOMEntity {
  private _children = [];
  createSection() {
    return new FragmentSection();
  }

  // render can be anything really - just so happens that
  // entities represent expressions, and so it's easier to return
  // the expressions themselves
  async render() {

    const ret = [];
    var j = 0;
    while(j++ < this.getAttribute('each')) {
      for (let i = 0, n = this.expression.childNodes.length; i < n; i++) {
        const childNode = this.expression.childNodes[i];
        ret.push(childNode);
      }
    }
    return ret;
  }
}

class DOMElementEntity {
  removeAttribute(name) {
    this.section.target.removeAttribute(name);
  }
  setAttribute(name, value) {
    this.section.target.setAttribute(name, value);
  }
  createSection() {
    return new NodeSection(this.fragments.query('nodeFactory').createElement('div'));
  }
  save() {
    patch(this.expression, diff(this.expression, this));
  }
}

class Import extends DOMEntity {
  render() {
    return this._load(this.expressions.src);
  }

  async _load = memoize((url) => {
    return parseHTML(await fetch(url));
  })
}

class Template extends Entity {
  render() {
    this.fragments.register(new ClassFactoryFragment(`entities/${this.getAttribute('id')}`, class extends DOMEntity {
      render = () => {
        return this.expression.childNodes;
      }
    }));
  }
}

var changes = diff(expr1, expr2);
patch(rootEntity, changes);
rootEntity.update();