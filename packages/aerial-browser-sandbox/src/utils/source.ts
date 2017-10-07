import * as md5 from "md5";

export const generateSourceHash = (source: string) => md5(source);