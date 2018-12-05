import * as React from "react";

export type FileOpener = () => Promise<any>;

export type FrontEndContextOptions = {
  openFile: any;
};

export const OpenFileContext = React.createContext<any>(null);
