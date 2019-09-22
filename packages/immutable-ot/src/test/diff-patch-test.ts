import { expect } from "chai";
import { diff, MutationType, patch } from "..";

describe(__filename + "#", () => {
  [
    [[0], [0, 1], [MutationType.INSERT]],
    [[0, 2, 3], [0, 1], [MutationType.REPLACE, MutationType.REMOVE]],
    [
      [0, 1, 2, 3],
      [3, 2, 1, 0],
      [MutationType.MOVE, MutationType.MOVE, MutationType.MOVE]
    ],
    [{ a: "b" }, { a: "c" }, [MutationType.SET]],
    [
      [{ a: "c", b: "c" }],
      [{ a: "d", b: "e" }],
      [MutationType.SET, MutationType.SET]
    ]
  ].forEach(([a, b, mutationTypes]) => {
    it(`can diff & patch ${JSON.stringify(a)} to ${JSON.stringify(b)}`, () => {
      const mutations = diff(a, b);
      const c = patch(a, mutations);
      expect(c).to.eql(b);
      expect(mutations.map(({ type }) => type)).to.eql(mutationTypes);
    });
  });
});
