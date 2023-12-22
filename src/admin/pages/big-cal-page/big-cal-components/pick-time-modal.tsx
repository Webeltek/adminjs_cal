import { Box, DatePicker,DatePickerProps, Modal, ModalInline, ModalProps} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'

export function PickTimeModal(props){
    const {onOverlayClick,onClose,shModal} = props;
    console.log("pick-time-modal shModal",shModal)
    const modalProps: ModalProps = {
        variant: 'primary',
        label: 'Select time period',
        icon: 'Calendar',
        title: 'Date and time',
        subTitle: 'Select start and stop time.',
        buttons: [{ label: 'Cancel' }, { label: 'Delete', color: 'danger' }],
        onClose : onClose,
        onOverlayClick : onOverlayClick    
    }
    const [date, setDate] = useState<string | null>('2023-12-01T14:32:00.000Z')
    const handleChange = (value) => {
        if (value) setDate(value)
        else setDate(null)
      }  

    return (
        shModal && 
        <Modal {...modalProps}> 
            <Box height="160px">
                <DatePicker
                onChange={handleChange}
                value={date ?? ''}
                disabled={false}
                propertyType='datetime'
                />
            </Box>
        </Modal>
    )
}
