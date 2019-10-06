export class WelcomeScreen {
  constructor(private _cy: Cypress.Chainable) {}

  assertIsVisible() {
    cy.get(`._5806cb87252`).should("be.visible");
  }
}
