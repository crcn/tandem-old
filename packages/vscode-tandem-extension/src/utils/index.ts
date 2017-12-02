export * from "./saga";

export const isPaperclipFile = (file: string) => /\.pc$/.test(file);