import { IApplication } from "@tandem/common/application";
import { CSS_MIME_TYPE, HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

// sandbox
import { HTMLCSSModule, HTMLCSSDOMModule } from "./sandbox";

import { HTML_XMLNS, SyntheticDOMNodeEntityClassDependency } from "@tandem/synthetic-browser";

import { 
  HTMLLinkEntity,
  HTMLStyleEntity,
  HTMLImageEntity,
  HTMLScriptEntity,
  VisibleHTMLEntity,
  HTMLDocumentEntity,
} from "./synthetic";

import {
  MarkupModule,
  HTML_TAG_NAMES,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";


import { LayerLabelComponentFactoryDependency } from "@tandem/editor/dependencies";

// layer components
import { TextLayerLabelComponent } from "./components/layer-labels/text";
import { CommentLayerLabelCoponent } from "./components/layer-labels/comment";
import { ElementLayerLabelComponent } from "./components/layer-labels/element";

// services
import { pastHTMLServiceDependency  } from "./services";

 // tools
import { textToolDependency, editInnerHTMLDependency } from "./models/text-tool";

// key bindings
import { keyBindingDependency } from "./key-bindings";

import { MimeTypeDependency } from "@tandem/common/dependencies";


const visibleEntityDependencies = HTML_TAG_NAMES.map((tagName) => new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, tagName, VisibleHTMLEntity));

export const htmlExtensionDependencies = [

  // sandbox
  ...visibleEntityDependencies,
  new SandboxModuleFactoryDependency(CSS_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSModule),
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSDOMModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, HTML_MIME_TYPE, MarkupModule),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "img", HTMLImageEntity),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "script", HTMLScriptEntity),
  new SyntheticDOMNodeEntityClassDependency(undefined, "#document", HTMLDocumentEntity),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "link", HTMLLinkEntity),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "style", HTMLStyleEntity),

  // layer components
  new LayerLabelComponentFactoryDependency(SyntheticHTMLElement.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticDOMText.name, TextLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticDOMElement.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticDOMComment.name, CommentLayerLabelCoponent),

  // services
  pastHTMLServiceDependency,

  // tools
  textToolDependency,
  editInnerHTMLDependency,

  // key bindings
  keyBindingDependency,


  // mime types
  new MimeTypeDependency("css", CSS_MIME_TYPE),
  new MimeTypeDependency("htm", HTML_MIME_TYPE),
  new MimeTypeDependency("html", HTML_MIME_TYPE)
];

export * from "./actions";
export * from "./constants";
export * from "./key-bindings";
export * from "./services";
export * from "./synthetic";