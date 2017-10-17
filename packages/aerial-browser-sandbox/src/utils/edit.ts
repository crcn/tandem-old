import { flatten } from "lodash";
import { generateSourceHash } from "./source";
import { Mutation, StringMutation, editString, weakMemo, arraySplice } from "aerial-common2";

export type ContentEditor = (content: string, mutation: Mutation<any>) => StringMutation | StringMutation[];

export type EditHistory = {
  content: string;
  mutations: Mutation<any>[];
};

const getMutationInsertionIndex = weakMemo((fingerprint: string, { content, mutations }: EditHistory) => {

  if (mutations.length === 0) {
    return 0;
  }

  for (let i = mutations.length; i--;) {
    const mutation = mutations[i];
    if (getMutationFingerprint(mutation) === fingerprint) {
      return i;
    }
  }

  // this might happen if the fingerprint is holder than the edit history
  throw new Error(`Unable to find matching fingerprint for edit history`);  
}); 

const getMutationFingerprint = mutation => mutation.target.source.fingerprint;

export const getComputedEditHistoryContent  = weakMemo(({ content, mutations }: EditHistory, edit: ContentEditor) => {

  let currentContent = content;
  let batchFingerprint = mutations.length && getMutationFingerprint(mutations[0]);
  let currentMutationBatch: Mutation<any>[] = [];

  let i = 0;
  const n = mutations.length;

  while(true) {
    const isLast = i === n;
    let commitChanges = isLast;

    if (!isLast) {
      const currentMutation = mutations[i];
      const currentMutationFingerprint = getMutationFingerprint(currentMutation);

      commitChanges = currentMutationFingerprint !== batchFingerprint;
      batchFingerprint = currentMutationFingerprint;

      if (!commitChanges) {
        currentMutationBatch.push(currentMutation);
      }
    }
    
    if (commitChanges) {
      currentContent = editString(currentContent, flatten(currentMutationBatch.map(edit.bind(this, currentContent))));
      currentMutationBatch = [];
    }

    if (isLast) {
      break;
    }

    i++;
  }

  return currentContent;

}); 

export const getEditHistoryFromFingerprint = weakMemo((fingerprint: string, { content, mutations }: EditHistory) => {
  return {
    content,
    mutations: mutations.slice(
      0, 
      getMutationInsertionIndex(fingerprint, { content, mutations })
    )
  }
});

export const insertContentMutation = (mutation: Mutation<any>, history: EditHistory, edit: ContentEditor) => {

  const { content, mutations } = history;

  if (!mutation.target || !mutation.target.source.fingerprint || !mutation.target.source.fingerprint) {
    throw new Error(`mutation.target.source.fingerprint property is missing`);
  }

  const fingerprint = mutation.target.source.fingerprint;

  const insertionIndex = getMutationInsertionIndex(fingerprint, { content, mutations });

  return {
    content,
    mutations: arraySplice(
      mutations,
      getMutationInsertionIndex(mutation.target.source.fingerprint, { content, mutations }),
      0,
      mutation
    )
  };
};
