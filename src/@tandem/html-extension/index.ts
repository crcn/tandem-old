import { IApplication } from "@tandem/common/application";
import { CSS_MIME_TYPE, HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

// sandbox
import {
  HTMLCSSModule,
  CSSASTEvaluator,
  CSSBundleLoader,
  HTMLCSSDOMModule,
  HTMLBundleLoader,
  HTMLASTEvaluator,
} from "./sandbox";

import {
  CSSEditor,
  HTML_XMLNS,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "@tandem/synthetic-browser";


import { 
  HTMLImageEntity,
  VisibleHTMLEntity,
  HTMLDocumentEntity,
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  SyntheticHTMLStyle,
} from "./synthetic";

import {
  MarkupModule,
  NoopDOMENtity,
  HTML_TAG_NAMES,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";

import {
  SandboxModuleFactoryDependency,
  BundlerLoaderFactoryDependency,
  ContentEditorFactoryDependency,
  SandboxModuleEvaluatorFactoryDependency,
} from "@tandem/sandbox";

import {
  StageToolComponentFactoryDependency,
  LayerLabelComponentFactoryDependency,
  EntityPaneComponentFactoryDependency,
} from "@tandem/editor/dependencies";

// layer components
import {
  TextLayerLabelComponent,
  CommentLayerLabelCoponent,
  ElementLayerLabelComponent,
  ElementInfoStageToolComponent,
  EntityAttributesPaneComponent,
} from "./components";

// services
import { pastHTMLServiceDependency  } from "./services";

 // tools
import { textToolDependency, editInnerHTMLDependency } from "./models/text-tool";

// key bindings
import { keyBindingDependency } from "./key-bindings";
import { MimeTypeDependency } from "@tandem/common/dependencies";

const visibleEntityDependencies = HTML_TAG_NAMES.map((tagName) => new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, tagName, VisibleHTMLEntity));

export const htmlExtensionDependencies = [

  // entities
  ...visibleEntityDependencies,
  new SandboxModuleFactoryDependency(CSS_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSModule),
  new SandboxModuleFactoryDependency(JS_MIME_TYPE, CSS_MIME_TYPE, HTMLCSSDOMModule),
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, HTML_MIME_TYPE, MarkupModule),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "img", HTMLImageEntity),
  new SyntheticDOMNodeEntityClassDependency(undefined, "#document", HTMLDocumentEntity),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "script", NoopDOMENtity),
  new SyntheticDOMNodeEntityClassDependency(HTML_XMLNS, "link", NoopDOMENtity),

  // elements
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "link", SyntheticHTMLLink),
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "script", SyntheticHTMLScript),
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "style", SyntheticHTMLStyle),

  // layer components
  new LayerLabelComponentFactoryDependency(SyntheticHTMLElement.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(VisibleHTMLEntity.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticHTMLStyle.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticHTMLScript.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticHTMLLink.name, ElementLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticDOMText.name, TextLayerLabelComponent),
  new LayerLabelComponentFactoryDependency(SyntheticDOMComment.name, CommentLayerLabelCoponent),


  // entity panes
  new EntityPaneComponentFactoryDependency("htmlAttributes", EntityAttributesPaneComponent),

  // stage tool components
  new StageToolComponentFactoryDependency("elementInfo", "pointer", ElementInfoStageToolComponent),

  // services
  pastHTMLServiceDependency,

  // bundle loaders
  new BundlerLoaderFactoryDependency(HTML_MIME_TYPE, HTMLBundleLoader),
  new BundlerLoaderFactoryDependency(CSS_MIME_TYPE, CSSBundleLoader),

  // sandbox evaluators
  new SandboxModuleEvaluatorFactoryDependency(undefined, HTML_MIME_TYPE, HTMLASTEvaluator),
  new SandboxModuleEvaluatorFactoryDependency(undefined, CSS_MIME_TYPE, CSSASTEvaluator),

  // edit consumers
  new ContentEditorFactoryDependency(CSS_MIME_TYPE, CSSEditor),

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
export * from "./sandbox";