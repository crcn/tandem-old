import Entity from 'saffron-common/src/entities/entity';
import NodeSection from 'saffron-common/src/section/node';
import FragmentSection from 'saffron-common/src/section/fragment';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import GroupPreview from '../preview/group';
import NodePreview from '../preview/node';

function convertStyle(style) {
  const converted = {};
  for (const key in style) {
    let v = style[key];
    if (/left|top|margin|width|height/.test(key) && !isNaN(v)) {
      v = v + 'px';
    }
    converted[key] = v;
  }
  return converted;
}

class ElementEntity extends Entity {

  public context:any;
  public _style:any;
  public ref:any;
  public section:any;
  public visible:boolean;
  public preview:any;

  constructor(properties) {
    super(Object.assign({}, properties, {
      type: 'display'
    }));

    this.context = {};
  }

  set style(value) {
    this._style = convertStyle(value);
    Object.assign(this.section.targetNode.style, convertStyle(value));
  }

  get style() {
    return this._style || {};
  }

  async load(options) {

    var attributes:any = {};

    for (const attribute of this.expression.attributes) {
      attributes[attribute.key] = (await attribute.load(options)).value;
    }

    this.attributes = attributes;

    var controllerFragment = options
    .fragments
    .queryAll<any>(`entity-controllers/${this.expression.nodeName}`)
    .find((fragment) => !fragment.test || (fragment.test(this) ? fragment : void 0));

    var ref;
    var section;
    var context = this.context;

    Object.assign(context, options.context || {}, context, attributes);

    if (controllerFragment) {
      ref = this.ref = controllerFragment.create(Object.assign(this, options, {
        attributes: attributes,
        expression: this.expression,
        context: this.context,
        entity: this
      }));

      section = ref.section;
      if (ref.section === options.section) {
        throw new Error('ref section must not be parent section');
      }

      await ref.load(Object.assign({}, options, {
        context,
        section
      }));
    } else {
      ref = document.createElement(this.expression.nodeName);
      for (const key in attributes) {
        ref.setAttribute(key, attributes[key]);
      }
      section = new NodeSection(ref);
      for (var childExpression of this.expression.childNodes) {
        this.appendChild(await childExpression.load(Object.assign({}, options, {
          context,
          section
        })));
      }
    }

    if (this.visible !== false) {
      if (section instanceof FragmentSection) {
        this.preview = new GroupPreview(this);
      } else {
        this.preview = new NodePreview(this);
      }
    }

    this.section = section;

    options.section.appendChild(section.toFragment());
  }

  async update(options) {
    for (var child of this.childNodes) {
      (child as Entity).update(options);
    }
  }

  willUnmount() {
    this.section.remove();
  }
}

export const fragment = new ClassFactoryFragment('entities/htmlElement', ElementEntity);
