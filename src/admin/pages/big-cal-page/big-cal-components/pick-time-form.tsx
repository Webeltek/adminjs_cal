import { Box, DatePicker,DatePickerProps, Label, 
    Modal, Input, ModalProps, FormGroup, Button} from '@adminjs/design-system'
import React, { useState, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSelector,useDispatch, connect } from 'react-redux'
import { useTranslation, ReduxState , PickTimeFormInState, ModalData} from 'adminjs'
import moment from 'moment'
import { ValidationError } from './ValidationError.js'

type formData = {
    eventTitle: string
}

export function PickTimeForm(props){
    const { handleSave } = props;
    const pickTimeFormState : PickTimeFormInState= useSelector((state: ReduxState)=> state.pickTimeForm)
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
    const {tc, tm, i18n: { language },} = useTranslation();    

    const handleStartChange = (value) => {
        if (value) setStartDate(value)
        else setStartDate(null)
    }
    
    const handleEndChange = (value) => {
        if (value) setEndDate(value)
        else setEndDate(null)
    }
    
    const filterStartDatetime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return selectedDate.getTime() < moment(endDate).toDate().getTime();
    };

    const filterEndDatetime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return selectedDate.getTime() > moment(startDate).toDate().getTime();
    };
    
    const onSaveEvent: SubmitHandler<formData> = (data: formData) => {
        console.log("pick-time-modal eventTitle,startDate",data.eventTitle, startDate)
            handleSave(data.eventTitle,startDate,endDate)
            hidePicker()
    }

    return (
        pickTimeFormState.show ? <Modal {...modModalData}>
                <Box as="form" noValidate onSubmit={handleSubmit(onSaveEvent)}>
                    <Label htmlFor="eventTitle">Insert event title</Label>
                    <Input  
                        id="eventTitle" 
                        type="text" 
                        variant="default" 
                        {...register('eventTitle',{required: "Enter event title"})}/>
                        <ValidationError fieldError={errors.eventTitle} />
                    <Box>
                        <DatePicker
                            onChange={handleStartChange}
                            value={startDate ?? ''}
                            disabled={false}
                            propertyType='datetime'
                            showTimeSelect
                            filterTime={filterStartDatetime}
                            locale= 'pt-BR'
                            timeFormat='p'
                        />
                    </Box>
                    <Box>
                        <DatePicker
                            onChange={handleEndChange}
                            value={endDate ?? ''}
                            disabled={false}
                            propertyType='datetime'
                            showTimeSelect
                            filterTime={filterEndDatetime}
                            locale= 'pt-BR'
                            timeFormat='p'
                        />
                    </Box>
                    <Box flex flexDirection="row" justifyContent="flex-end" mt="xl">
                        <Button mr="md" mt="sm"
                        type="submit" label="Save1" color="danger" size="md"> medium size
                        </Button>
                    </Box>
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
