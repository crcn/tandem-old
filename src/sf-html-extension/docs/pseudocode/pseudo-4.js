class TemplateComponent extends Entity {
  didMount() {
    this.nodeFactory.registerElement(this.getAttribute('id'), class extends Entity {
      render = async () => {
        return this.expression.childNodes;
      }
    });
  }
  willUnmount() {
    this.nodeFactory.unregisterElement(this.getAttribute('id'));
  }
  async render() {
    return this.expression.childNodes;
  }
}

class ImportComponent extends Entity {
  async render() {
    // memoize this
    return await parseHTML(this.getAttribute('src'));
  }
}

class DOMElement extends Entity {
  async render() {
    return this.expression.childNodes;
  }
}

class Entity {
  constructor(public expression:IHTMLExpression) {

  }
  async render() {
    var controller = this.fragments
  }
}

async function createEntity(expression, fragments) {
  var element = new Entity(expression, fragments);
  for (const childNode of expression.childNodes) {
    element.appendChild(render(childNode));
  }
  return element;
}

var expr1 = parseHTML('<div><template id="template">hello</template><hello /></div>');

var entity = createEntity(expr1, app.fragments);

function renderEntity(entity) {
  var mapped = entity.render();

}

