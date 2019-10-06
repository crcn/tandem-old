/// <reference types="Cypress" />

import { WelcomeScreen } from "./welcome";
import { Editor } from "./editor";

export class App {
  constructor(private _cy: Cypress.Chainable) {}

  load() {
    cy.visit("/lib/front-end/test.html");
    return this;
  }

  getEditor() {
    return new Editor(this._cy);
  }

  getWelcomeScreen() {
    return new WelcomeScreen(this._cy);
  }

  static create(_cy: Cypress.Chainable = cy) {
    return new App(_cy);
  }
}
