import { configureStore } from '@reduxjs/toolkit';
import useReducer from './event-slice.js';

export const eventStore = configureStore({
    reducer: {eventReducer: useReducer}
})

export type RootState = ReturnType<typeof eventStore.getState>;