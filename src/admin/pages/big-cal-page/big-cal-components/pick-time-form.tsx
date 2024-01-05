import { Box, DatePicker,DatePickerProps, Label, 
    Modal, Input, ModalProps, FormGroup, Button} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSelector,useDispatch, connect } from 'react-redux'
import { ReduxState , PickTimeFormInState, ModalData} from 'adminjs'
import moment from 'moment'

type formData = {
    eventTitle: string
}

export function PickTimeForm(props){
    const { handleSave } = props;
    const pickTimeFormState = useSelector((state: ReduxState)=> state.pickTimeForm)
    console.log("pick-time-form pickTimeFormState",pickTimeFormState)
    const dispatch = useDispatch();
    const hidePicker = () => dispatch({ type: 'HIDE_PICK_TIME_FORM'})
    const modModalData: ModalProps = {
        ...pickTimeFormState,
        buttons: [
            { label: 'Cancel', onClick: hidePicker }, 
            { label: 'Save', color: 'danger' , type: "submit"}],
        onClose : hidePicker,
        onOverlayClick : hidePicker,
        } 
    const [startDate, setStartDate] = useState<string | null>(modModalData.start)
    const [endDate, setEndDate] = useState<string | null>(modModalData.end)
    const { register, handleSubmit, watch, 
        formState: { errors , isSubmitting, isSubmitSuccessful} } = useForm<formData>();

    const handleStartChange = (value) => {
        if (value) setStartDate(value)
        else setStartDate(null)
    }
    
    const handleEndChange = (value) => {
        if (value) setEndDate(value)
        else setEndDate(null)
    }
    
    
    const onSaveEvent: SubmitHandler<formData> = (data: formData) => {
        console.log("pick-time-modal eventTitle,startDate",data.eventTitle, startDate)
            handleSave(data.eventTitle,startDate,endDate)
            hidePicker()
    }

    return (
        pickTimeFormState.show ? <Modal {...modModalData}>
                <Box as="form" noValidate onSubmit={handleSubmit(onSaveEvent)}>
                    <Label htmlFor="eventTitle">Inser event title</Label>
                    <Input  
                        id="eventTitle" 
                        type="text" 
                        variant="default" 
                        {...register('eventTitle',{required: "Enter event title"})}/>
                        {errors.eventTitle && <div>{errors.eventTitle.message}</div>}
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
                    <Button type="submit" ml="default" label="Save1" color="danger" size="sm">Regular size</Button>
                </Box>
            </Modal>
    : null)
    }   

/* export const mapStateToProps = (state: ReduxState,ownProps)=> {
    return {
        pickTimeFormState:  { show: false},
        pickTimeFormData: ownProps
    }
    
}

const createMyAction = () => ({ type: 'SHOW_PICK_TIME_FORM'})
export const mapDispatchToProps = (dispatch, ownProps) => {
  //const boundActions = bindActionCreators({ createMyAction }, dispatch)
  return {
    dispatchHideForm: () => dispatch({ 
        type: 'HIDE_PICK_TIME_FORM',
    }),
    //dispatchActionCreatedByActionCreator: () => dispatch(createMyAction()),
    //...boundActions,
    // you may return dispatch here
    dispatch,
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)(PickTimeForm) */
