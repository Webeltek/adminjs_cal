import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type State = { 
    start : string,
    end : string
}

const initialState : State = {
    start: new Date().toISOString(),
    end: new Date().toISOString()
}

export const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setStartEndAction: (state, action: PayloadAction<State | undefined>)=>{
           state.start = action.payload.start;
           state.end = action.payload.end; 
        }
    }
    
})

export const { setStartEndAction} = eventSlice.actions;
export default eventSlice.reducer;