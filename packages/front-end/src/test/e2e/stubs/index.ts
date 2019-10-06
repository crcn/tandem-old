import {
  createPCModule,
  createPCComponent,
  createPCStyleBlock,
  createPCElement
} from "paperclip";

export enum StubFSType {
  FILE,
  DIRECTORY
}

export type BaseStubFSItem<TType extends StubFSType> = {
  type: TType;
  name: string;
};

export type StubFile = {
  content: Buffer;
} & BaseStubFSItem<StubFSType.FILE>;

export type StubDirectory = {
  children: StubFSItem[];
} & BaseStubFSItem<StubFSType.DIRECTORY>;

export type StubFSItem = StubFile | StubDirectory;

export const getFSItem = (path: string, directory: StubDirectory) => {
  if (path === "." || path === "/") return directory;
  path = path.replace(/^\/|\/$/, "");
  return path.split("/").reduce((current, part) => {
    return current.children.find(child => child.name === part);
  }, directory);
};

export const basicStub: StubDirectory = {
  name: "root",
  type: StubFSType.DIRECTORY,
  children: [
    {
      name: "test.pc",
      type: StubFSType.FILE,
      content: new Buffer(
        JSON.stringify(
          createPCModule([
            createPCComponent(
              "test component",
              "div",
              [],
              [],
              [
                createPCElement("div", [
                  createPCStyleBlock([
                    {
                      key: "background",
                      value: "red"
                    },
                    {
                      key: "width",
                      value: "100px"
                    },
                    {
                      key: "height",
                      value: "100px"
                    }
                  ])
                ])
              ],
              {
                bounds: {
                  left: 0,
                  top: 0,
                  right: 100,
                  bottom: 100
                }
              }
            )
          ])
        ),
        "utf8"
      )
    }
  ]
};
