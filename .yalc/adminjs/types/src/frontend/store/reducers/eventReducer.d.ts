export type EventInState = {
    start: string;
    end: string;
};
export declare const eventReducer: (state: {
    start: string;
    end: string;
} | undefined, action: {
    type: string;
    data: EventInState;
}) => {
    start: string;
    end: string;
};
