import { HTMLParser } from 'sf-html-extension';


var rootExpression = HTMLParser.parse(`<div>
  <import src="./templates.sfn" />
  <hello-world />
</div>
`);


function update()

class EntityOptions {
  dependencies:Dependencies;
}

interface IElement {

}

class DOMElementAttributesController {
  constructor(entity:ElementEntity) {

  }

  async update() {

  }
}

class DOMElementEntityController {
  constructor(entity:ElementEntity) {

  }

  async update() {

  }
}


class ElementEntity {

  public controller:EntityController;

  constructor(public expression:HTMLElementExpression, public dependencies:Dependencies) {
    dependencies.query('application').instance
  }

  update(expression:HTMLElementExpression) {
    var controllerDependency = this.options.dependencies.query(`entityControllers/${expression.nodeName}`);
    if (this._controllerDependency !== _controllerDependency) {
      this._controller = controllerDependency.create(this);
    }
  }
}


class Root {
  private _currentDependency:Dependency;
  private _entity:Entity;

  constructor(private _options:EntityOptions) {

  }

  async update(expression:BaseExpression) {
    var entityDependency = this._options.dependencies.query(`entities/${expression.ns}`);

    if (this._currentDependency !== entityDependency) {
      this._entity = entityDependency.create(this._options);
    }

    await this._entity.update(expression);
  }
}


var root = new Root(rootExpression);
root.update(HTMLParser.parse(`<div>
  <import src="./templates.sfn" />
  <hello-world />
</div>
`));

