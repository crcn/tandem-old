import { keyBindingProvider } from "./key-bindings";
import { Kernel, CommandFactoryProvider, LoadApplicationRequest } from "@tandem/common";
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
  BottomGutterTabComponentProvider,
  StageToolComponentFactoryProvider,
  LayerLabelComponentFactoryProvider,
  EntityPaneComponentFactoryProvider,
  DocumentPaneComponentFactoryProvider,
} from "@tandem/editor/browser";

import {
  WatchVMLogsCommand,
  ExpandSelectedCommand,
  UpdateMergedRuleCommand,
  AddSyntheticElementCommand,
} from "./commands";

import {
  UnitTokenInput,
  ColorTokenInput,
  ConsoleComponent,
  NumberTokenInput,
  AnimationsComponent,
  ReferenceTokenInput,
  LayersPaneComponent,
  MediaQueriesComponent,
  HTMLStylePaneComponent,
  ElementCSSPaneComponent,
  ElementCSSInspectorComponent,
  ElementInfoStageToolComponent,
  ElementAttributesPaneComponent,
} from "./components";

export function createHTMLEditorBrowserProviders() {

  return new Kernel(
    new CommandFactoryProvider(LoadApplicationRequest.LOAD, WatchVMLogsCommand),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, ExpandSelectedCommand),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, ExpandSelectedCommand),
    new CommandFactoryProvider(SelectionChangeEvent.SELECTION_CHANGE, UpdateMergedRuleCommand),
    new CommandFactoryProvider(AddSyntheticObjectRequest.ADD_SYNTHETIC_OBJECT, AddSyntheticElementCommand),

    // entity panes
    new EntityPaneComponentFactoryProvider("htmlAttributes", ElementAttributesPaneComponent),
    new EntityPaneComponentFactoryProvider("cssInspector", ElementCSSInspectorComponent),
    new DocumentPaneComponentFactoryProvider("htmlLayers", LayersPaneComponent),

    // stage tool components
    new StageToolComponentFactoryProvider("elementInfo", "pointer", ElementInfoStageToolComponent),
    
    new BottomGutterTabComponentProvider("animations", "Animations", AnimationsComponent, 0),
    new BottomGutterTabComponentProvider("mediaQueries", "Media queries", MediaQueriesComponent, 0),
    new BottomGutterTabComponentProvider("console", "Console", ConsoleComponent, Infinity),
    
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