
import { Application } from 'sf-common/applications';

// services
import { fragment as projectsFragment } from './services/project';
import { fragment as clipboardService } from './services/clipboard';
import { fragment as backEndServiceFragment } from './services/back-end';
import { fragment as selectorServiceFragment } from './services/selector';
import { fragment as keyBindingsServiceFragment } from './services/key-binding';
import { fragment as rootComponentRendererFragment } from './services/root-component-renderer';

// key bindings
import { fragment as keyBindingsFragment } from './key-bindings';

// extensions
import { fragment as domExtensionFragment } from 'sf-dom-extension';
import { fragment as htmlExtensionFragment } from 'sf-html-extension';

export default class FrontEndApplication extends Application {
  _registerFragments() {
    super._registerFragments();
    this.fragments.register(

      // services
      clipboardService,
      // projectsFragment,
      backEndServiceFragment,
      selectorServiceFragment,
      keyBindingsServiceFragment,
      rootComponentRendererFragment,

      // fragments
      keyBindingsFragment,

      // extensions
      htmlExtensionFragment,
      domExtensionFragment
    );
  }
}