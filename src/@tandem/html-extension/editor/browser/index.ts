import { Injector } from "@tandem/common";
import { keyBindingProvider } from "./key-bindings";
import { pastHTMLServiceProvider } from "./services";
import { createHTMLCoreProviders } from "../../core";
import { textToolProvider, editInnerHTMLProvider } from "./models";

import {
  SyntheticDOMText,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";

import {
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  EntityPaneComponentFactoryProvider,
} from "@tandem/editor/browser";

import {
  SyntheticHTMLLink,
  SyntheticHTMLStyle,
  SyntheticHTMLScript,
} from "@tandem/html-extension/synthetic";

import {
  TextLayerLabelComponent,
  CommentLayerLabelCoponent,
  ElementLayerLabelComponent,
  ElementInfoStageToolComponent,
  EntityAttributesPaneComponent,
} from "./components";

export function createHTMLEditorBrowserProviders() {

  return new Injector(

    createHTMLCoreProviders(),

    // layer components
    new LayerLabelComponentFactoryProvider(SyntheticHTMLElement.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLStyle.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLScript.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLLink.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticDOMText.name, TextLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticDOMComment.name, CommentLayerLabelCoponent),

    // entity panes
    new EntityPaneComponentFactoryProvider("htmlAttributes", EntityAttributesPaneComponent),

    // stage tool components
    new StageToolComponentFactoryProvider("elementInfo", "pointer", ElementInfoStageToolComponent),

    // services
    pastHTMLServiceProvider,

    // tools
    textToolProvider,
    editInnerHTMLProvider,

    // key bindings
    keyBindingProvider
  );
}

export * from "./components";
export * from "./key-bindings";
export * from "./services";
export * from "./models";
export * from "../../core";
export * from "../worker";
