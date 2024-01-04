export declare const INITIALIZE_EVENT = "INITIALIZE_EVENT";
export type InitializeEventResponse = {
    type: typeof INITIALIZE_EVENT;
    data: {
        start: string;
        end: string;
    };
};
export declare const initializeEvent: (data: {
    start: string;
    end: string;
}) => InitializeEventResponse;
