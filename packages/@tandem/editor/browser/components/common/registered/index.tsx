import React =  require("react");
import { EditorStore } from "@tandem/editor/browser/stores";
import { BaseApplicationComponent, appComponentContextTypes, inject } from "@tandem/common";
import { ReactComponentFactoryProvider, PageFactoryProvider, EditorStoreProvider } from "@tandem/editor/browser/providers";

export class RegisteredComponent extends BaseApplicationComponent<{ ns: string, providers?: ReactComponentFactoryProvider[] } & any, any> {
  render() {
    return <span> { (this.props.providers || ((this.kernel && this.kernel.queryAll<ReactComponentFactoryProvider>(this.props.ns)) || []).map((dependency, i) => {
      return dependency.create(Object.assign({ key: i }, this.props));
    }))} </span>;
  }
}

export class PageOutletComponent extends BaseApplicationComponent<{ pageName: string } & any, any> {
  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;
  
  render() {
    const pageName: string = this._store.router.state[this.props.routeName];
    if (!pageName) return null;
    return <span> { this.kernel.queryAll<ReactComponentFactoryProvider>(PageFactoryProvider.getId(pageName)).map((dependency, i) => {
      return dependency.create(Object.assign({ key: i }, this.props));
    })} </span>;
  }
}
