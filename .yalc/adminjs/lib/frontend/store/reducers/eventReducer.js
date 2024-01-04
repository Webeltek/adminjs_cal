import { INITIALIZE_EVENT } from "../actions/initialize-event.js";
export const eventReducer = (state = {
  start: "",
  end: ""
}, action) => {
  switch (action.type) {
    case INITIALIZE_EVENT:
      return action.data;
    default:
      return state;
  }
};