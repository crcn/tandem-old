import { keyBindingProvider } from "./key-bindings";
import { createHTMLCoreProviders } from "../../core";
import { Kernel, CommandFactoryProvider } from "@tandem/common";
import { textToolProvider, editInnerHTMLProvider, HTMLExtensionStore } from "./stores";

import {
  SyntheticDOMText,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";

import { HTMLExtensionStoreProvider } from "./providers";

import { CSSTokenTypes } from "@tandem/html-extension/tokenizers";

import {
  SelectionChangeEvent,
  AddSyntheticObjectRequest,
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
  AddSyntheticElementCommand,
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
  ElementCSSPaneComponent,
  ElementInfoStageToolComponent,
  ElementAttributesPaneComponent,
} from "./components";

export function createHTMLEditorBrowserProviders() {

  return new Kernel(
    createHTMLCoreProviders(),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, ExpandSelectedCommand),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, UpdateMergedRuleCommand),
    new CommandFactoryProvider(AddSyntheticObjectRequest.ADD_SYNTHETIC_OBJECT, AddSyntheticElementCommand),

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
export * from "./stores";
export * from "../../core";
export * from "../worker";
export * from "./providers";