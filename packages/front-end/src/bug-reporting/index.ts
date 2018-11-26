import * as React from "react";
import * as ReactDOM from "react-dom";
import { Main } from "./components/main/view.pc";

export const init = () => {
  let triggered = false;

  // API endpoint somewhere
  const submitTicket = (error: Error, description: string) => {
    console.log("SUBMIT", error, description);
  };

  const triggerError = error => {
    console.error(error);
    if (triggered) {
      return;
    }

    triggered = true;

    const div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(
      React.createElement(Main, {
        submitTicket: description => submitTicket(error, description)
      }),
      div
    );
  };

  return {
    triggerError
  };
};
