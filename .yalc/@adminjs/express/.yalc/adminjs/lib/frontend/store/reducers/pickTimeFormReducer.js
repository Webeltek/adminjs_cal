import { SHOW_PICK_TIME_FORM, HIDE_PICK_TIME_FORM } from '../actions/pick-time-form.js';
export const pickTimeFormReducer = (state = {
  show: false
}, action) => {
  switch (action.type) {
    case SHOW_PICK_TIME_FORM:
      {
        return {
          ...action.data,
          show: true
        };
      }
    case HIDE_PICK_TIME_FORM:
      {
        return {
          show: false
        };
      }
    default:
      return state;
  }
};