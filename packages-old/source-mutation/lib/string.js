"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRING_REPLACE = "STRING_REPLACE";
exports.createStringMutation = function (startIndex, endIndex, value) {
    if (value === void 0) { value = ""; }
    return ({
        startIndex: startIndex,
        endIndex: endIndex,
        value: value,
        type: exports.STRING_REPLACE
    });
};
exports.editString = function (input, mutations, offsetMutations) {
    if (offsetMutations === void 0) { offsetMutations = []; }
    var output = input;
    var computedReplacements = [];
    var offsetMutationCount = offsetMutations.length;
    var allMutations = offsetMutations.concat(mutations);
    for (var i = 0, n = mutations.length; i < n; i++) {
        var _a = mutations[i], startIndex = _a.startIndex, endIndex = _a.endIndex, value = _a.value;
        var offsetStartIndex = startIndex;
        var offsetEndIndex = endIndex;
        var invalid = false;
        var insertion = startIndex === endIndex;
        var n2 = i + offsetMutationCount;
        // based on all of the previous edits, calculate where this edit is
        for (var j = 0; j < n2; j++) {
            var _b = allMutations[j], previousStartIndex = _b.startIndex, previousEndIndex = _b.endIndex, previousNewValue = _b.value;
            var prevInsertion = previousStartIndex === previousEndIndex;
            var startIndicesMatch = startIndex === previousStartIndex;
            var endIndicesMatch = endIndex === previousEndIndex;
            // input :  a b c d e f g h i
            // prev  :     ^-------^
            // ✔     :     ^
            var insertBeginning = startIndicesMatch && insertion;
            // input :  a b c d e f g h i
            // prev  :     ^-------^
            // ✔     :             ^
            var insertEnd = endIndicesMatch && insertion;
            // input :  a b c d e f g h i
            // prev  :     ^
            // ✔     :     ^-------^
            var prevInsertBeginning = startIndicesMatch && prevInsertion;
            // input :  a b c d e f g h i
            // prev  :     ^
            // ✔     :     ^-------^
            var prevInsertEnd = endIndicesMatch && prevInsertion;
            var currOrPrevInserting = insertBeginning || insertEnd || prevInsertBeginning || prevInsertEnd;
            // input :  a b c d e f g h i
            // prev  :         ^-------^ 
            // ✔     :     ^-------^
            if (previousStartIndex < endIndex && previousStartIndex > startIndex) {
                offsetEndIndex = offsetEndIndex - (endIndex - previousStartIndex);
            }
            // input :  a b c d e f g h i
            // prev  :   ^-----^
            // ✔     :       ^-------^
            if (previousEndIndex > startIndex && previousEndIndex < endIndex) {
                offsetStartIndex = offsetStartIndex + (previousEndIndex - startIndex);
            }
            // Invalid edit because previous replacement 
            // completely clobbers this one. There's nothing else to edit.
            // input :  a b c d e f g h i 
            // prev  :   ^---------^
            // ✔     :     ^---^
            // ✔     : ^-------------^
            // ✘     :   ^
            // ✘     :             ^
            // ✘     :   ^-----------^
            if (((startIndex >= previousStartIndex && endIndex <= previousEndIndex) ||
                (startIndex < previousStartIndex && endIndex >= previousEndIndex)) && !currOrPrevInserting) {
                invalid = true;
                break;
            }
            // input :  a b c d e f g h
            // prev  :     ^-----^
            // ✔     :       ^-----^
            // ✔     :           ^---^
            // ✔     :               ^-^
            // ✔     : ^-----^
            // ✘     : ^---^
            // ✘     :   ^-^
            // ✘     :     ^
            // input :  a b c d e f g h
            // prev  : ^---^
            // ✔     :   ^---^
            if (previousStartIndex <= startIndex && endIndex > previousStartIndex) {
                var prevValueLengthDelta = previousNewValue.length - (previousEndIndex - previousStartIndex);
                // shift left or right
                offsetStartIndex = Math.max(0, offsetStartIndex + prevValueLengthDelta);
                offsetEndIndex = Math.max(0, offsetEndIndex + prevValueLengthDelta);
            }
        }
        if (!invalid) {
            output = output.substr(0, offsetStartIndex) + value + output.substr(offsetEndIndex);
        }
    }
    return output;
};
// TODO
// export type ContentEditor = (content: string, mutation: Mutation<any>) => StringMutation | StringMutation[];
// export const generateSourceHash = (source: string) => source;
// export type EditHistoryCommit = {
//   fingerprint: string;
//   mutations: Mutation<any>[];
//   lateMutations: Mutation<any>[];
// }
// export type EditHistory = {
//   content: string;
//   commits: EditHistoryCommit[];
// };
// const getHistoryCommitIndex = (fingerprint: string, { content, commits }: EditHistory) => {
//   for (let i = commits.length; i--;) {
//     const commit = commits[i];
//     if (commit.fingerprint === fingerprint) return i;
//   }
//   return -1;
// }; 
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
//# sourceMappingURL=string.js.map