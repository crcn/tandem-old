// import expect from "expect.js";
// import BaseDisplayEntity from "@tandem/common/entities/display";
// import calculateDistances from "./calculate-distances";

/*

[{
  entity: Entity,
  intercections: [
    Intercection.create()
  ]
}]

*/

// class TestDisplayEntity extends BaseDisplayEntity {
//   constructor(properties, children = []) {
//
//     super({
//       fragmentId: "test",
//       ...properties,
//     }, children);
//
//     this.preview = {
//       getBoundingRect: () => this,
//     };
//   }
// }

describe(__filename + "#", () => {

  const cases = {

    "finds entities left of bounds": [
      [

        // top check
        ["ent1", 100, 100, 100, 100],
        ["ent2", 0, 50, 100, 100],
        ["ent3", 0, 201, 100, 100],
        ["ent4", 0, 200, 100, 100],

        // left check
        ["ent5", 300, 100, 100, 100],
        ["ent6", 301, 201, 100, 100],
      ],
      [200, 100, 100, 100],
      ["ent1", "ent2", "ent4", "ent5"],
    ],
  };

  function createCase(title/* , [entities, bounds, equals] */) {
    it(title, () => {

      // var ent = TestDisplayEntity.create({
      //   fragmentId: "frag",
      // }, entities.map(function ([id, left, top, width, height]) {
      //   return TestDisplayEntity.create({
      //     left, top, width, height, fragmentId: "frag", id: id, type: "component",
      //   });
      // })).flatten().map(function (entity) {
      //   return entity.preview.getBoundingRect();
      // });
      //
      // var [left, top, width, height] = bounds;
    });
  }

  // for (const c in cases) createCase(c, cases[c]);
});
