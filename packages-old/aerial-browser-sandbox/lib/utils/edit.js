// import { flatten } from "lodash";
// import { generateSourceHash } from "./source";
// import { Mutation, StringMutation, editString, weakMemo, arraySplice, arrayReplaceIndex } from "aerial-common2";
// export type ContentEditor = (content: string, mutation: Mutation<any>) => StringMutation | StringMutation[];
// export type EditHistoryCommit = {
//   fingerprint: string;
//   mutations: Mutation<any>[];
//   lateMutations: Mutation<any>[];
// }
// export type EditHistory = {
//   content: string;
//   commits: EditHistoryCommit[];
// };
// const getHistoryCommitIndex = weakMemo((fingerprint: string, { content, commits }: EditHistory) => {
//   for (let i = commits.length; i--;) {
//     const commit = commits[i];
//     if (commit.fingerprint === fingerprint) return i;
//   }
//   return -1;
// }); 
// const getMutationFingerprint = mutation => mutation.target.source.fingerprint;
// export const getComputedEditHistoryContent  = weakMemo(({ content, commits }: EditHistory, edit: ContentEditor) => {
//   let currentContent = content;
//   const lateMutations: StringMutation[] = [];
//   for (const commit of commits) {
//     const editCurrentContent = edit.bind(this, currentContent);
//     const lateCommitStringMutations = flatten(commit.lateMutations.map(editCurrentContent)) as StringMutation[];
//     currentContent = editString(currentContent, flatten([
//       ...commit.mutations.map(editCurrentContent),
//       ...lateMutations,
//       ...lateCommitStringMutations
//     ]));
//     lateMutations.push(...lateCommitStringMutations);
//   }
//   return currentContent;
// }); 
// export const updateContent = (mutation: Mutation<any>, history: EditHistory, edit: ContentEditor): EditHistory => {
//   const { content, commits } = history;
//   if (!mutation.target || !mutation.target.source.fingerprint || !mutation.target.source.fingerprint) {
//     throw new Error(`mutation.target.source.fingerprint property is missing`);
//   }
//   const fingerprint = mutation.target.source.fingerprint;
//   const commitIndex = getHistoryCommitIndex(fingerprint, { content, commits });
//   if (~commitIndex) {
//     const commit = commits[commitIndex];
//     return {
//       content,
//       commits: arrayReplaceIndex(
//         commits,
//         commitIndex,
//         // if the commit is the last one in the history, then just append the edit
//         commitIndex === commits.length - 1 ? {
//           ...commit,
//           mutations: [
//             ...commit.mutations,
//             mutation
//           ]
//         // otherwise register the commit as late so that future commits can make edits
//         // accordingly
//         } : {
//           ...commit,
//           lateMutations: [
//             ...commit.lateMutations,
//             mutation
//           ]
//         }
//       ) as EditHistoryCommit[]
//     }
//   } else {
//     return {
//       content,
//       commits: [
//         ...commits,
//         {
//           fingerprint: fingerprint,
//           mutations: [mutation],
//           lateMutations: []
//         }
//       ]
//     }
//   }
// };
//# sourceMappingURL=edit.js.map