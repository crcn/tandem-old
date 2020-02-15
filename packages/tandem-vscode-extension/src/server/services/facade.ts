import { TextDocument } from "vscode-languageserver-textdocument";
import { Engine } from "paperclip";
import { BaseLanguageService, BaseEngineLanguageService } from "./base";
import { PCHTMLLanguageService } from "./html";
import { PCCSSLanguageService } from "./css";

class LanguageServiceFacade extends BaseLanguageService {
  constructor(private _services: BaseLanguageService[]) {
    super();
    for (const service of this._services) {
      service.onEvent(event => this.dispatch(event));
    }
  }
}

export const createFacade = (engine: Engine) => {
  return new LanguageServiceFacade([
    new PCCSSLanguageService(engine),
    new PCHTMLLanguageService(engine)
  ]);
};
