// import { diff2 } from "..";
// import { patch2, mergeOts } from "../diff-patch";
// import { expect } from "chai";

// describe(__filename + "#", () => {
//   // simple diff & patch
//   [
//     // update string prop
//     [
//       {
//         id: "a",
//         name: "a"
//       },
//       {
//         id: "a",
//         name: "b"
//       }
//     ],

//     // simple shuffle
//     [[0, 1, 2, 3], [3, 2, 1, 0]],
//     [[0, 5, 0, 5], [5, 0, 5, 0]],

//     [[{ id: "a" }, { id: "b" }], [{ id: "b" }, { id: "a" }]]
//   ].forEach(([oldItem, newItem]) => {
//     it(`can diff & patch ${JSON.stringify(oldItem)} to ${JSON.stringify(
//       newItem
//     )}`, () => {
//       const ots = diff2(oldItem, newItem);
//       const patchedItem = patch2(oldItem, ots);
//       console.log(ots);
//       expect(patchedItem).to.eql(newItem);
//     });
//   });

//   // convergence

//   [
//     // update string prop
//     [
//       {
//         id: "a",
//         name: "a"
//       },
//       {
//         id: "a",
//         name: "b"
//       },
//       {
//         id: "a",
//         name: "c"
//       },
//       {
//         id: "a",
//         name: "c"
//       }
//     ]
//   ].forEach(([old, a, b, aAndB]) => {
//     it(`can merge ${JSON.stringify(a)} and ${JSON.stringify(
//       b
//     )} to get ${JSON.stringify(aAndB)}`, () => {
//       const ots1 = diff2(old, a);
//       const ots2 = diff2(old, b);
//       const ots = mergeOts(ots1, shuffle(ots2));
//       const patchedItem = patch2(old, ots);
//       console.log(ots);
//       expect(patchedItem).to.eql(aAndB);
//     });
//   });
// });

// const shuffle = (ary: any[]) => {
//   const newAry = [];
//   const pool = ary.concat();

//   while (pool.length) {
//     const index = Math.floor(Math.random() * pool.length);
//     const item = pool[index];
//     newAry.push(item);
//     pool.splice(index, 1);
//   }

//   return newAry;
// };
