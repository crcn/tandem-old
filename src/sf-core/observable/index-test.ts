import { Action } from '../actions';
import { Observable } from "./index";
import { expect } from 'chai';

describe(__filename + "#", function() {
  it("can be created", function() {
    new Observable();
  });

  it("can observe the observable for any action", function() {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      execute: action => i++
    });

    obs.notify(new Action('change'));
    expect(i).to.equal(1);
  });

  it("can add multiple observers the observable for any action", function() {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      execute: action => i++
    });
    obs.observe({
      execute: action => i++
    });
    obs.notify(new Action('change'));
    expect(i).to.equal(2);
  });
});