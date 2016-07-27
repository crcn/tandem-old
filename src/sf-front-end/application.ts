
import { Application } from 'sf-common/applications';
import { thread, isMaster } from 'sf-core/workers';

// components
import { fragment as rootComponentFragment } from './components/root';
import { fragment as sfnStageComponentFragment } from './components/sfn-stage';

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
import { fragment as htmlExtensionFragment } from 'sf-html-extension';

export default class FrontEndApplication extends Application {

  stageTools = [];
  currentTool = {};

  protected registerFragments() {
    super.registerFragments();
    this.fragments.register(

      // components
      rootComponentFragment,
      sfnStageComponentFragment,

      // services
      clipboardService,
      projectsFragment,
      backEndServiceFragment,
      selectorServiceFragment,
      keyBindingsServiceFragment,
      rootComponentRendererFragment,

      // fragments
      keyBindingsFragment,

      // extensions
      htmlExtensionFragment
    );
  }
}