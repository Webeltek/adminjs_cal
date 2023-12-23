import { Box, DatePicker,DatePickerProps, Label, Modal, Input, ModalProps} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'

export function PickTimeModal(props){
    const {onOverlayClick,onClose,shModal,start,end,handleModalSaveEvt} = props;
    if (shModal){
        console.log("pick-time-modal shModal,start",shModal,start)
        const [evtTitle,setEvtTitle]= useState('');
        const modalProps: ModalProps = {
            variant: 'primary',
            label: 'Create event',
            icon: 'Calendar',
            title: 'Define event parameters',
            subTitle: 'Insert title',
            buttons: [{ label: 'Cancel', onClick: onClose }, { label: 'Save', color: 'danger' , onClick: onSaveEvent}],
            onClose : onClose,
            onOverlayClick : onOverlayClick    
        }
        const [startDate, setStartDate] = useState<string | null>(start)
        const handleStartChange = (value) => {
            if (value) setStartDate(value)
            else setStartDate(null)
        }
        const [endDate, setEndDate] = useState<string | null>(end)
        const handleEndChange = (value) => {
            if (value) setEndDate(value)
            else setEndDate(null)
        }
        function onSaveEvent(){
            handleModalSaveEvt('alabala',startDate,endDate)
        }

        return (
            <Modal {...modalProps}>
                <Label htmlFor="evtTitle">Inser event title</Label>
                <Input id="evtTitle" type="text" variant="default"/> 
                <Box>
                    <DatePicker
                        onChange={handleStartChange}
                        value={startDate ?? ''}
                        disabled={false}
                        propertyType='datetime'
                    />
                </Box>
                <Box>
                    <DatePicker
                        onChange={handleEndChange}
                        value={endDate ?? ''}
                        disabled={false}
                        propertyType='datetime'
                    />
                </Box>
            </Modal>
        )
    }
    
}
