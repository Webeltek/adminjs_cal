import type { ModalProps } from '@adminjs/design-system'

import { SHOW_MODAL, HIDE_MODAL , SHOW_PICK_TIME_FORM, HIDE_PICK_TIME_FORM} from '../store/index.js'

export interface ModalData {
  modalProps: ModalProps;
  type?: 'alert' | 'confirm';
  resourceId?: string;
  confirmAction?: () => void;
}

export type ModalFunctions = {
  openModal: (data: ModalData) => void
  closeModal: () => void
}

export type ShowModalResponse = {
  type: typeof SHOW_MODAL
  data: ModalData;
}

export type HideModalResponse = {
  type: typeof HIDE_MODAL;
}
