import { expect } from 'chai';
import { HTMLTextEntity } from '../entities/index';
import Runtime from '../index.ts';
import getNode from 'saffron-front-end/src/utils/node/get-node';


describe(__filename + '#', function() {

  async function loadEntity(source, element:HTMLDivElement = undefined) {
    const runtime = new Runtime();
    const entity = (await runtime.load(source)).entity;
    if (element != undefined) {
      element.appendChild(runtime.symbolTable.getValue<any>('currentSection').toFragment());
    }
    return entity;
  }

  describe('rendering smoke tests#', function() {
    [
      ['<div>a b c</div>'],
      ['<div>a b</div><div>c d</div>'],
      ['<div>a b</div>Hello World'],
      ['<div style="color:red;">blarg</div>'],
      ['<h1 style="color:red;">blarg</h1>'],
      ['<h1 id="test">blarg</h1>'],
      ['<h1 a b c="d">blarg</h1>', '<h1 a="" b="" c="d">blarg</h1>'],
      ['<h1 style="color:red;">blarg</h1><!--  comment -->']
    ].forEach(function([source, equal]) {
      it(`can render ${source}`, async function() {
        const div = document.createElement('div');
        await loadEntity(source, div);
        expect(div.innerHTML).to.equal(equal || source);
      });
    });
  });

  describe('patching#', function() {

    let runtime:Runtime;

    beforeEach(function() {
      runtime = new Runtime();
    });

    async function load(source) {
      await runtime.load(source);
      const div = document.createElement('div');
      div.appendChild(runtime.symbolTable.getValue<any>('currentSection').toFragment());
      expect(div.innerHTML).to.equal(source);
      return runtime.entity;
    }

    it('properly patches basic entities', async function() {
      var aTextNode = getNode(await load('<div>a</div>'), [0, 0]);
      var bTextNode = getNode(await load('<div>b</div>'), [0, 0]);
      expect(aTextNode).to.equal(bTextNode);

      await load('<div>c</div>hello');
      var cTextNode = getNode(runtime.entity, [0, 0]);
      expect(bTextNode).to.equal(cTextNode);
  
      var aHelloNode = getNode(runtime.entity, [1]);
      expect(aHelloNode.value).to.equal('hello');

      var bHelloNode = getNode(await load('jello'), [0]);
      expect(aHelloNode).to.equal(bHelloNode);

      var divNode = getNode(await load('<div>a</div>'), [0]);
    });

    it('replaces a node if the tag names do not match', async function() {
      var aTextNode = getNode(await load('<span>hello</span>'), [0, 0]);
      var bTextNode = getNode(await load('<div>hello</div>'), [0, 0]);
      expect(aTextNode).not.to.equal(bTextNode);
    });
    
    it('properly patches attributes', async function() {
      var adiv = getNode(await load('<div a="b"></div>'), [0]);
      var bdiv = getNode(await load('<div a="c"></div>'), [0]);
      expect(adiv).to.equal(bdiv);
      expect(adiv.getAttribute('a')).to.equal('c');
    });

    it('removes deleted expressions', async function() {
      await load('<div a="b"></div>');
      await load('');
    });
  });
});