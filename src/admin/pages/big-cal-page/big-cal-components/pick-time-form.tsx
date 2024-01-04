import { Box, DatePicker,DatePickerProps, Label, 
    Modal, Input, ModalProps, FormGroup} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSelector,connect } from 'react-redux'
import { ReduxState } from 'adminjs'
import moment from 'moment'

type eventType = {
    eventTitle: string
}

export function PickTimeForm(props){
    const { handleModalSaveEvt } = props;
    const [startDate, setStartDate] = useState<string | null>(props.start)
    const [endDate, setEndDate] = useState<string | null>(props.end)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<eventType>();
    console.log("pick-time-form props.start,props.end",props.start,props.end)

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
            <Modal {...props}>
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

export const mapStateToProps = (state: ReduxState,ownProps)=> {
    return {
        mapStateStart: state.event.start,
        mapStateEnd : state.event.end
    }
    
}

const createMyAction = () => ({ type: 'INITIALIZE_EVENT' })
export const mapDispatchToProps = (dispatch) => {
  //const boundActions = bindActionCreators({ createMyAction }, dispatch)
  return {
    dispatchPlainObject: (dispatchStart,dispatchEnd) => dispatch({ 
        type: 'INITIALIZE_EVENT',
        data: {
            start: dispatchStart,
            end: dispatchEnd 
        }
    }),
    //dispatchActionCreatedByActionCreator: () => dispatch(createMyAction()),
    //...boundActions,
    // you may return dispatch here
    dispatch,
  }
}

/* export default connect(
    mapStateToProps,
    mapDispatchToProps)(PickTimeModalForm)  */
