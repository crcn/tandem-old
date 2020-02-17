import { Engine } from "paperclip";
import { BaseLanguageService } from "./base";
import { PCHTMLLanguageService } from "./html";

/**
 * Generic service facade for handling Paperclip ASTs
 */

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
    // new PCCSSLanguageService(engine),
    // new PCJSLanguageService(engine),
    new PCHTMLLanguageService(engine)
  ]);
};
