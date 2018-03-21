import { Mutation } from "./base";

export const STRING_REPLACE = "STRING_REPLACE";

export type StringMutation = {
  startIndex: number;
  endIndex: number;
  value: string;
} & Mutation<any>;

export const createStringMutation = (startIndex: number, endIndex: number, value: string = ""): StringMutation => ({
  startIndex,
  endIndex,
  value,
  type: STRING_REPLACE
});

export const editString = (input: string, mutations: StringMutation[], offsetMutations: StringMutation[] = []) => {
  let output = input;

  const computedReplacements: Array<[number, number, string]> = [];
  const offsetMutationCount = offsetMutations.length;

  const allMutations = [...offsetMutations, ...mutations];

  for (let i = 0, n = mutations.length; i < n; i++) {
    const {startIndex, endIndex, value} = mutations[i];

    let offsetStartIndex = startIndex;
    let offsetEndIndex   = endIndex;
    let invalid          = false;
    const insertion      = startIndex === endIndex;

    const n2 = i + offsetMutationCount;

    // based on all of the previous edits, calculate where this edit is
    for (let j = 0; j < n2; j++) {
      const {startIndex: previousStartIndex, endIndex: previousEndIndex, value: previousNewValue} = allMutations[j];

      const prevInsertion     = previousStartIndex === previousEndIndex;
      const startIndicesMatch = startIndex === previousStartIndex;
      const endIndicesMatch   = endIndex === previousEndIndex;

      // input :  a b c d e f g h i
      // prev  :     ^-------^
      // ✔     :     ^
      const insertBeginning        = startIndicesMatch && insertion;

      // input :  a b c d e f g h i
      // prev  :     ^-------^
      // ✔     :             ^
      const insertEnd              = endIndicesMatch && insertion;

      // input :  a b c d e f g h i
      // prev  :     ^
      // ✔     :     ^-------^
      const prevInsertBeginning    = startIndicesMatch && prevInsertion;
      
      // input :  a b c d e f g h i
      // prev  :     ^
      // ✔     :     ^-------^
      const prevInsertEnd         = endIndicesMatch && prevInsertion;

      const currOrPrevInserting   = insertBeginning || insertEnd || prevInsertBeginning || prevInsertEnd;

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
      if (
          (
            (startIndex >= previousStartIndex && endIndex <= previousEndIndex) || 
            (startIndex < previousStartIndex && endIndex >= previousEndIndex)
          ) && !currOrPrevInserting) {
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
        const prevValueLengthDelta = previousNewValue.length - (previousEndIndex - previousStartIndex);

        // shift left or right
        offsetStartIndex = Math.max(0, offsetStartIndex + prevValueLengthDelta);
        offsetEndIndex   = Math.max(0, offsetEndIndex + prevValueLengthDelta);
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
