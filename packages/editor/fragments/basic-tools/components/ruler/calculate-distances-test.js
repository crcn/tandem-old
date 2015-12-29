import expect from 'expect.js';
import BaseDisplayEntity from 'editor/entities/display';
import calculateDistances from './calculate-distances';

/*

[{
  entity: Entity,
  intercections: [
    Intercection.create()
  ]
}]

*/

class TestDisplayEntity extends BaseDisplayEntity {
  constructor(properties, children = []) {

    super({
      fragmentId: 'test',
      ...properties
    }, children);

    this.setComputer({
      getStyle: () => {
        return this;
      }
    });
  }
}

describe(__filename + '#', function() {

  var cases = {

    'finds entities left of bounds': [
      [

        // top check
        ['ent1', 100 , 100, 100, 100],
        ['ent2', 0   , 50 , 100, 100],
        ['ent3', 0   , 201 , 100, 100],
        ['ent4', 0   , 200 , 100, 100],

        // left check
        ['ent5', 300 , 100 , 100, 100],
        ['ent6', 301 , 201 , 100, 100]
      ],
      [200, 100, 100, 100],
      ['ent1', 'ent2', 'ent4', 'ent5']
    ]
  };

  function createCase(title, [entities, bounds, equals]) {
    it(title, function() {

      var ent = TestDisplayEntity.create({
        fragmentId: 'frag'
      }, entities.map(function([id, left, top, width, height]) {
        return TestDisplayEntity.create({
          left, top, width, height, fragmentId: 'frag', id: id, type: 'component'
        })
      }));

      var [left, top, width, height] = bounds;

      var intersects = calculateDistances(ent, { left, top, width, height });

      var ids = intersects.map(function(entity) {
        return entity.id;
      });

      expect(ids).to.eql(equals);
    });
  }

  for (var c in cases) createCase(c, cases[c]);
});
