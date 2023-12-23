import { Box, DatePicker,DatePickerProps, Modal, ModalInline, ModalProps} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'

export function PickTimeModal(props){
    const {onOverlayClick,onClose,shModal,start,end} = props;
    console.log("pick-time-modal shModal,start",shModal,start)
    const modalProps: ModalProps = {
        variant: 'primary',
        label: 'Select time period',
        icon: 'Calendar',
        title: 'Date and time',
        subTitle: 'Select start and stop time.',
        buttons: [{ label: 'Cancel' }, { label: 'Save', color: 'danger' }],
        onClose : onClose,
        onOverlayClick : onOverlayClick    
    }
    const [date, setDate] = useState<string | null>(start)
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
