import { Box, DatePicker,DatePickerProps, Label, 
    Modal, Input, ModalProps, FormGroup} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ReduxState } from 'adminjs'
import moment from 'moment'

type eventType = {
    eventTitle: string
}

export function PickTimeModalForm(props){
    const {handleModalSaveEvt} = props;
    const start = useSelector((state: ReduxState)=> state.event.start);
    const end = useSelector((state: ReduxState)=> state.event.end);
    const [startDate, setStartDate] = useState<string | null>(start)
    const [endDate, setEndDate] = useState<string | null>(end)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<eventType>();
    console.log("pick-time-form start,end",start,end)
    const handleStartChange = (value) => {
        if (value) setStartDate(value)
        else setStartDate(null)
    }
    
    const handleEndChange = (value) => {
        if (value) setEndDate(value)
        else setEndDate(null)
    }
    
    function onSaveEvent(data: eventType){
        console.log("pick-time-modal data.eventTitle",data.eventTitle)
        handleModalSaveEvt(data.eventTitle,startDate,endDate)
    }

    return (
            <Box as="form" noValidate onSubmit={handleSubmit(onSaveEvent)}>
                <Label htmlFor="eventTitle">Inser event title</Label>
                <Input  id="eventTitle" type="text" variant="default" {...register('eventTitle')}/> 
                <Box>
                    <DatePicker
                        onChange={handleStartChange}
                        value={start ?? ''}
                        disabled={false}
                        propertyType='datetime'
                    />
                </Box>
                <Box>
                    <DatePicker
                        onChange={handleEndChange}
                        value={end ?? ''}
                        disabled={false}
                        propertyType='datetime'
                    />
                </Box>
            </Box>
    )
    
}
