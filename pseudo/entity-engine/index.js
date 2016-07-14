
var fragmentDictionary = parentFragmentDictionary.createChild();


class ElementExpression {
  constructor(nodeName, attributes, childNodes) {
    Object.assign(this, { nodeName, attributes, childNodes });
  }

  async load({ fragmentDictionary }) {
    var fragment = fragmentDictionary.query(`entities/${this.nodeName}`);

    var entity = fragmentDictionary.create();
    await entity.load({ fragmentDictionary });

    for (var child of this.childNodes) {
      entity.appendChild(await child.load());
    }

    return entity;
  }
}

class FrameEntity {
  async load({ fragmentDictionary }) {
    var self = this;

    fragmentDictionary.register(Fragment.create({
      ns: `entities/${this.nodeName}`,
      factory: {
        create() {
          return RegisteredComponent.create({ frame: self })
        }
      }
    }))
  }
}

var rootExpression = parse(`
  <saffron>
    <import src='./file.sfn' />

    <custom-element  />
    <import2 src='./file2.sfn' />
  </saffron>
`);
