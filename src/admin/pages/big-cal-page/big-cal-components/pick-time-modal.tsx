import { Box, DatePicker,DatePickerProps, Label, 
    Modal, Input, ModalProps, FormGroup} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type eventType = {
    eventTitle: string
}

export function PickTimeModal(props){
    const {onOverlayClick,onClose,shModal,start,end,handleModalSaveEvt} = props;
    const [startDate, setStartDate] = useState<string | null>(start)
    const [endDate, setEndDate] = useState<string | null>(end)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<eventType>();
    if (shModal){
        console.log("pick-time-modal shModal,start",shModal,start)
        const handleStartChange = (value) => {
            if (value) setStartDate(value)
            else setStartDate(null)
        }
        
        const handleEndChange = (value) => {
            if (value) setEndDate(value)
            else setEndDate(null)
        }
        
        function onSaveEvent(data: eventType){
            console.log("pick-time-modal data",data)
            handleModalSaveEvt(data.eventTitle,startDate,endDate)
        }
        const modalProps: ModalProps = {
            variant: 'primary',
            label: 'Create event',
            icon: 'Calendar',
            title: 'Define event parameters',
            subTitle: 'Insert title',
            buttons: [
                { label: 'Cancel', onClick: onClose }, 
                { label: 'Save', color: 'danger' , onClick: onSaveEvent, type: "submit"}],
            onClose : onClose,
            onOverlayClick : onOverlayClick    
        }

        return (
            <Modal {...modalProps}>
                <Box as="form" noValidate onSubmit={handleSubmit(onSaveEvent)}>
                    <Label htmlFor="eventTitle">Inser event title</Label>
                    <Input  id="eventTitle" type="text" variant="default" {...register('eventTitle')}/> 
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
                </Box>
            </Modal>
        )
    }
    
}
