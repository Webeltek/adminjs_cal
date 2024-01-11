import {  SHOW_PICK_TIME_FORM, HIDE_PICK_TIME_FORM } from '../actions/pick-time-form.js';
import type { ModalData } from '../../interfaces/index.js'

export type PickTimeFormInState = (ModalData & { show: true }) | { show: false }

export const pickTimeFormReducer = (
    state: PickTimeFormInState = { show: false },
    action: {
      type: string
      data: ModalData
    },
  ): PickTimeFormInState => {
    switch (action.type) {
    case SHOW_PICK_TIME_FORM: {
      return {
        ...action.data,
        show: true,
      }
    }
    case HIDE_PICK_TIME_FORM: {
      return { show: false }
    }
    default:
      return state
    }
  }