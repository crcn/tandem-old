import { SyntheticHTMLElement, SyntheticDOMAttribute } from "@tandem/synthetic-browser";

const _cache = {};
function getScript(source) {
  if (_cache[source]) return _cache[source];
  return _cache[source] = new Function(`element`, `attributes`, `
    with(attributes) with(element) {
      try {
        return ${source}
      } catch(e) {
        return undefined;
      }
    }
  `);
}

export class SyntheticTDTemplateElement extends SyntheticHTMLElement {

  createdCallback() {
    if (this.hasAttribute("id")) {
      const id = this.getAttribute("id");
      this.registerTemplateElement(id);
    } else if (this.hasAttribute("is")) {
      this.cast(this.getAttribute("is"));
    } else {
      this.attach(this);
    }
  }

  private registerTemplateElement(tagName: string) {
    const template = this;
    this.ownerDocument.registerElementNS(this.namespaceURI, tagName, class SyntheticModuleElement extends SyntheticHTMLElement {
      private _cloned;
      addPropertiesToClone(clone: SyntheticModuleElement, deep: boolean) {
        super.addPropertiesToClone(clone, deep);
        clone._cloned = true;
      }
      createdCallback() {
        if (this._cloned !== true) {
          template.attach(this);
        }
      }
    });
  }

  private cast(tagName: string) {
    const elementClass = this.ownerDocument.$getElementClassNS(this.namespaceURI, tagName);
    const element = new elementClass(this.namespaceURI, tagName, this.ownerDocument) as SyntheticHTMLElement;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(element);
    this.attach(element);
    element.$createdCallback();
  }

  private attach(element: SyntheticHTMLElement) {
    const shadow = element.attachShadow({ mode: "open" });
    const div = element.ownerDocument.createElementNS(this.namespaceURI, "div") as SyntheticHTMLElement;
    div.innerHTML = this.parseTemplate(element, this.innerHTML);
    while(div.firstChild) shadow.appendChild(div.firstChild);
  }

  parseTemplate(element: SyntheticHTMLElement, source: string) {
    return source.replace(/{{.*?}}/g, (block, script) => {
      const ret = this.evaluateBlock(block, element);
      if (ret instanceof SyntheticDOMAttribute) {
        return (<SyntheticDOMAttribute>ret).value;
      }
      if (ret === element.childNodes) {
        return element.innerHTML;
      }
      return ret;
    })
  }

  private evaluateBlock(block: string, element: SyntheticHTMLElement) {
    if (!/{{.*?}}/.test(block)) return block;
    const fn = getScript(block.substr(2, block.length - 4));
    return fn(element, element.attributes);
  }
}