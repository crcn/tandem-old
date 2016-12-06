declare module "gaze" {
  function gaze(path:any, watcher:Function):any;
  namespace gaze {

  }
  export = gaze;
}

declare module "package-path" {
  function getPakagePath(rest:any):any;
  namespace getPakagePath {
    function sync(arg:any):any;
  }
  export = getPakagePath;
}

declare module "mongoid-js" {

  function mongoid(): string;

  namespace mongoid {

  }

  export = mongoid;
}

declare module "react-slider" {

  function ReactSlider();

  namespace ReactSlider {

  }

  export = ReactSlider;
}


declare module "ent" {
  function encode(source: string): string;
  function decode(source: string): string;
}

declare module "react-input-autosize" {
  import React =  require("React");

  class AutosizeInput extends React.Component<any, any> {

  }

  namespace AutosizeInput {

  }

  export = AutosizeInput;
}

declare module "store" {
  export function get(key: string): any;
  export function set(key: string, value: any);
}

// declare module "memoizee" {
//   function memoize(fn: Function, options?: any);

//   namespace memoize {

//   }

//   export = memoize;
// }

declare module "memoizee" {
  function memoize(fn: Function, options?: any);

  namespace memoize {

  }

  export = memoize;
}

declare module "postcss-scss" {
  function parseSass();
  namespace parseSass { }
  export = parseSass;
}

declare module "sass.js" {

  namespace sass {
    export function options(ops: any, callback?: Function);
    export function compile(text: string, options: any, callback: Function);
    export function compileFile(filename: string, options: any, callback: Function);
    export function importer(callback: Function);
  }

  export = sass;
}

declare module "rasterizehtml" {
  namespace rasterizeHTML {
    export function drawDocument(document: HTMLDocument, canvas: HTMLCanvasElement): Promise<any>;
  }
  export = rasterizeHTML;
}

declare module "titlebar" {

  interface ITitlebar {
    appendTo(element: HTMLElement);
    on(event:"close", listener: Function);
    element: HTMLElement;
    destroy();
  }

  function titlebar(): ITitlebar;

  namespace titlebar {

  }

  export = titlebar;
}

declare module "loader-utils" {
  export function parseQuery(query: any): any;
  export function getLoaderConfig(module, name: string): any;
}

declare module "react-tappable" {
  import React =  require("React");

  class HammerComponent extends React.Component<any, any>{

  }
  namespace HammerComponent {

  }
  export = HammerComponent;
}

declare module "w3c-xmlhttprequest" {
  export class XMLHttpRequest { }
}

declare module "vue-loader" {
  function loader();
  namespace loader {

  }
  export = loader;
}

declare module "md5" {
  function md5(source: string);
  namespace md5 {

  }
  export = md5;
}

declare module "figlet" {
  export function textSync(value: string, options: {
    font: string,
    horizontalLayout?: string,
    verticalLayout?: string
  });
}

declare module "node-libs-browser" {
  const libs: any;
  namespace libs {

  }
  export = libs;
}

declare module "detective" {
  function detective(path: string);
  namespace detective {

  }
  export = detective;
}

declare module "ansi_up" {
  export function ansi_to_html(source: string): string;
}

declare module "abab" {
  export function btoa(value: any): any;
  export function atob(value: any): any;
}

declare module "postcss-cssnext" {
  import postcss =  require("postcss");
  export = postcss;
}


declare module "canvas-prebuilt" {

  class Canvas extends HTMLCanvasElement {
    constructor(width: number, height: number);
  }

  namespace Canvas {

  }

  export = Canvas;
}

declare module "detect-font" {
  function supportedFonts(html: HTMLElement): string[];
  function detectFont(element: HTMLElement): string|boolean;
}

declare module "rc-checkbox" {
  import React =  require("React");
  
  class RCCheckbox extends React.Component<{ className?: string, type: string, prefixCls?: string, name?: string, checked?: number, onChange: (checked: number) => any}, any> {

  }

  namespace RCCheckbox {

  }

  export = RCCheckbox;
}

declare module "react-file-input" {
  import React =  require("React");
  interface FileInputProps {
    name: string;
    className: string;
    accept: string;
    placeholder: string;
    disabled?: boolean;
    onChange: (event: React.SyntheticEvent<any>) => void;
  }

  class FileInputComponent extends React.Component<FileInputProps, {}> {
  }

  namespace FileInputComponent {

  }

  export = FileInputComponent;
}

declare module "strip-indent" {
  function stripIndent(value: string): string;
  namespace stripIndent {

  }
  export = stripIndent;
}