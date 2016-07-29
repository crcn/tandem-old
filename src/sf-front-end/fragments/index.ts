import * as React from "react";

import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { IFactory, BaseFragment, FragmentDictionary } from "sf-core/fragments";

import { KeyBinding } from "sf-front-end/key-bindings/base";

import { ReactComponentFactoryFragment } from "./base";

export * from "./base";

export const KEY_BINDINGS_NS = "key-bindings";
export class KeyBindingFragment extends BaseFragment {
  constructor(readonly keyBinding: KeyBinding) {
    super(`${KEY_BINDINGS_NS}/${keyBinding.key}`);
  }
  static findAll(fragments: FragmentDictionary) {
    return fragments.queryAll<KeyBindingFragment>(`${KEY_BINDINGS_NS}/**`);
  }
}

export const ROOT_COMPONENT_NS = "components/root";
export class RootReactComponentFragment extends ReactComponentFactoryFragment {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ROOT_COMPONENT_NS, componentClass);
  }
  static find(fragments: FragmentDictionary) {
    return fragments.query<RootReactComponentFragment>(ROOT_COMPONENT_NS);
  }
}

export const ENTITY_PREVIEW_COMPONENT_NS = "components/preview";
export class EntityPreviewFragment extends ReactComponentFactoryFragment {
  constructor(componentClass: React.ComponentClass<any>) {
    super(ENTITY_PREVIEW_COMPONENT_NS, componentClass);
  }
  static find(fragments: FragmentDictionary) {
    return fragments.query<RootReactComponentFragment>(ENTITY_PREVIEW_COMPONENT_NS);
  }
}