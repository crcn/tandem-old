import { Mutation } from "aerial-common2";
import { generateSourceHash } from "./source";

export type ContentEditor = (content: string, mutation: Mutation<any>) => any;

export type EditHistory = {
  content: string;
  mutations: Mutation<any>[];
};

const getHistoryContentFromFingerprint = (fingerprint: string, { content, mutations }: EditHistory, edit: ContentEditor) => {
  if (generateSourceHash(content) === fingerprint) return content;

  for (const mutation of mutations) {
    content = edit(content, mutation);
  }
};


