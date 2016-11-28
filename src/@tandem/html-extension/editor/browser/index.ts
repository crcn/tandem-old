import { keyBindingProvider } from "./key-bindings";
import { createHTMLCoreProviders } from "../../core";
import { Injector, CommandFactoryProvider } from "@tandem/common";
import { textToolProvider, editInnerHTMLProvider, HTMLExtensionStore } from "./models";

import {
  SyntheticDOMText,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";

import { HTMLExtensionStoreProvider } from "./providers";

import { CSSTokenTypes } from "@tandem/html-extension/tokenizers";

import {
  SelectionChangeEvent,
  TokenComponentFactoryProvider,
  FooterComponentFactoryProvider,
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  EntityPaneComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider,
} from "@tandem/editor/browser";

import {
  ExpandSelectedCommand,
  UpdateMergedRuleCommand,
} from "./commands";

import {
  SyntheticHTMLLink,
  SyntheticHTMLStyle,
  SyntheticHTMLScript,
} from "@tandem/html-extension/synthetic";

import {
  NumberTokenInput,
  ColorTokenInput,
  UnitTokenInput,
  ReferenceTokenInput,
  LayersPaneComponent,
  ElementCSSInspectorComponent,
  HTMLStylePaneComponent,
  TextLayerLabelComponent,
  ElementCSSPaneComponent,
  CommentLayerLabelCoponent,
  ElementLayerLabelComponent,
  ElementInfoStageToolComponent,
  ElementAttributesPaneComponent,
} from "./components";

export function createHTMLEditorBrowserProviders() {

  return new Injector(
    createHTMLCoreProviders(),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, ExpandSelectedCommand),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, UpdateMergedRuleCommand),

    // layer components
    new LayerLabelComponentFactoryProvider(SyntheticHTMLElement.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLStyle.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLScript.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticHTMLLink.name, ElementLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticDOMText.name, TextLayerLabelComponent),
    new LayerLabelComponentFactoryProvider(SyntheticDOMComment.name, CommentLayerLabelCoponent),

    // entity panes
    new EntityPaneComponentFactoryProvider("htmlAttributes", ElementAttributesPaneComponent),
    // new EntityPaneComponentFactoryProvider("htmlStyle", HTMLStylePaneComponent),
    new EntityPaneComponentFactoryProvider("cssInspector", ElementCSSInspectorComponent),
    // new EntityPaneComponentFactoryProvider("htmlCSSRules", ElementCSSPaneComponent),
    new DocumentPaneComponentFactoryProvider("htmlLayers", LayersPaneComponent),

    // stage tool components
    new StageToolComponentFactoryProvider("elementInfo", "pointer", ElementInfoStageToolComponent),

    // mini text editor token inputs
    new TokenComponentFactoryProvider(CSSTokenTypes.COLOR, ColorTokenInput),
    new TokenComponentFactoryProvider(CSSTokenTypes.UNIT, UnitTokenInput),
    new TokenComponentFactoryProvider(CSSTokenTypes.DEGREE, ColorTokenInput),
    new TokenComponentFactoryProvider(CSSTokenTypes.NUMBER, NumberTokenInput),
    new TokenComponentFactoryProvider(CSSTokenTypes.REFERENCE, ReferenceTokenInput),

    new HTMLExtensionStoreProvider(HTMLExtensionStore),
    
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
