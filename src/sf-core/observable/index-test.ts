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

  it("can immediately stop an action from propagating", function() {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      execute: (action) => { i++; action.stopImmediatePropagation(); }
    });
    obs.observe({
      execute: action => i++
    });
    obs.notify(new Action('change'));
    expect(i).to.equal(1);
  });

  it("can stop an action from bubbling", function() {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      execute: (action) => {
        if (i > 0) action.stopPropagation();
      }
    });

    const obs2 = new Observable();

    obs2.observe({
      execute: action => i++
    });

    obs.observe({ execute: obs2.notify.bind(obs2) })
    obs.notify(new Action('change'));
    expect(i).to.equal(1);
    obs.notify(new Action('change'));
    expect(i).to.equal(1);

  });
});