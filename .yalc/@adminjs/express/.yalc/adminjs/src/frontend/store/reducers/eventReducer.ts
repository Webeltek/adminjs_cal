import { INITIALIZE_EVENT } from "../actions/initialize-event.js";

export type EventInState = {
    start : string,
    end : string
}

export const eventReducer = (
    state : { start : string, end: string} = { start: "", end : ""},
    action : {
        type: string
        data : EventInState
    }
) => {
    switch(action.type){
        case INITIALIZE_EVENT:
            return action.data
        default:
            return state    
    }
} 