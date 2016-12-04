import { WebMenuItemFactoryProvider } from "../providers";
import { IMessage } from "@tandem/mesh";
import { 
  inject, 
  Injector, 
  ICommand,
  TreeNode, 
  ITreeNode,
  IBrokerBus,
  IInjectable, 
  InjectorProvider, 
  PrivateBusProvider, 
} from "@tandem/common";

export class WebMenuItem extends TreeNode<WebMenuItem> {

  @inject(InjectorProvider.ID)
  protected injector: Injector;

  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;
  

  constructor(readonly name: string, public type?: string, public label?: string, public role?: string, public keyCombo?: string, public click?: () => any) {
    super();
  }
  
  initialize() {
    for (const child of WebMenuItemFactoryProvider.createSubWebMenuItems(this, this.injector)) {
      this.appendChild(child);
      child.initialize();
    }
  }

  // primarily for electron

  toMenuTemplate() {
    const children = this.children.map(child => child.toMenuTemplate());
    return {
      type: this.type,
      label: this.label,
      click: this.click,
      role: this.role,
      accelerator: this.keyCombo,
      submenu: children.length ? children : undefined
    }
  }
}


export function createWebMenuItemClass(label?: string, role?: string, keyCombo?: string, click?: () => any): { new(name: string): WebMenuItem } {
  return class extends WebMenuItem {
    constructor(name: string) {
      super(name, undefined, label, role, keyCombo, click);
    }
  }
}


export function createMenuSeparatorClass(): { new(name: string): WebMenuItem } {
  return class extends WebMenuItem {
    constructor(name: string) {
      super(name, "separator");
    }
  }
}

export function createKeyCommandMenuItemClass(label: string, keyCombo: string, requestClass: { new(): IMessage } ): { new(name: string): WebMenuItem } {
  return class extends WebMenuItem {
    constructor(name: string) {
      super(name, undefined, label, undefined, keyCombo, () => {
        this.bus.dispatch(new requestClass());
      });
    }
  }
}