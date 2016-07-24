import { HTMLParser } from 'saffron-html-extension';

var rootExpression = HTMLParser.parse(`<div>
  <import src="./templates.sfn" />
  <hello-world />
</div>
`);


class EntityOptions {
  fragments:FragmentDictionary;
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

  constructor(public expression:HTMLElementExpression, public fragments:Fragments) {
    fragments.query('application').instance
  }

  update(expression:HTMLElementExpression) {
    var controllerFragment = this.options.fragments.query(`entityControllers/${expression.nodeName}`);
    if (this._controllerFragment !== _controllerFragment) {
      this._controller = controllerFragment.create(this);
    }
  }
}


class Root {
  private _currentFragment:Fragment;
  private _entity:Entity;

  constructor(private _options:EntityOptions) {

  }

  async update(expression:BaseExpression) {
    var entityFragment = this._options.fragments.query(`entities/${expression.ns}`);

    if (this._currentFragment !== entityFragment) {
      this._entity = entityFragment.create(this._options);
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

