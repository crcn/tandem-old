import { expect } from 'chai';
import { EntityEngine } from './engine';
import { ElementEntity, ValueNodeEntity } from './base';
import { FragmentDictionary, EntityFactoryFragment } from '../fragments';

function element(name, attributes = [], ...childNodes) {
  return {
    name: name,
    nodeName: name,
    attributes: attributes,
    childNodes: childNodes
  };
}

function text(nodeValue) {
  return {
    name: '#text',
    nodeValue: nodeValue
  };
}

describe(__filename + "#", function() {
  it("can be created", function() {
    new EntityEngine(new FragmentDictionary());
  });

  it("maps an element to an entity", async function() {
    const engine = new EntityEngine(new FragmentDictionary());
    const entity = await engine.load(element('div'));
    expect(entity).to.be.an.instanceof(ElementEntity);
  });

  it("can register a custom entity", async function() {
    class CustomEntity extends ElementEntity { }
    const fragments = new FragmentDictionary();
    fragments.register(new EntityFactoryFragment('custom', CustomEntity));
    const engine = new EntityEngine(fragments);
    expect(await engine.load(element('custom'))).to.be.an.instanceOf(CustomEntity);
  });

  it('renders child nodes based on the returned value from load()', async function() {
    class CustomEntity extends ElementEntity {
      render() {
        expect((this.source as any).nodeName).to.equal('custom1');
        return { nodeName: '#text', nodeValue: 'something' };
      }
    }
    const fragments = new FragmentDictionary();
    fragments.register(new EntityFactoryFragment('custom1', CustomEntity));
    const engine = new EntityEngine(fragments);
    let currentEntity = await engine.load(element('custom1'));
    expect((<ElementEntity>currentEntity).childNodes.length).to.equal(1);
  });
});