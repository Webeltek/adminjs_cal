import type { ModalData } from '../../interfaces/index.js';
export type PickTimeFormInState = (ModalData & {
    show: true;
}) | {
    show: false;
};
export declare const pickTimeFormReducer: (state: PickTimeFormInState | undefined, action: {
    type: string;
    data: ModalData;
}) => PickTimeFormInState;
