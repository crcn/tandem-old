import { Action } from "redux";
import { ApplicationState, updateApplicationState } from "../state";
import { WATCH_URIS_REQUESTED, WatchUrisRequested } from "../actions";

export function mainReducer(state: ApplicationState, event: Action) {

  switch(event.type) {
    case WATCH_URIS_REQUESTED: {
      const { uris } = event as WatchUrisRequested;
      return updateApplicationState(state, {
        watchUris: uris
      })
    }
  }
 
  return state;
}