import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes, { bool } from 'prop-types'
import { Calendar, Views, CalendarProps, DateLocalizer } from 'react-big-calendar'
import DemoLink from './DemoLink.component.js'
import { PickTimeModalForm } from './pick-time-form.js'
import events from './events.js'
import { PrismaClient } from '@prisma/client';
import moment from 'moment'
import { ApiClient , RecordActionAPIParams, useTranslation, ReduxState, useModal} from 'adminjs'
import 'moment/locale/nb'
import { useSelector } from 'react-redux'
import { Box, Button, Label, VariantType, Modal,ModalProps} from '@adminjs/design-system'

type ApiGetPageResponse = { prismaEvts : evtType[] };
const api = new ApiClient();
export type evtType = {
  id?: number;
  title?: string;
  allDay?: boolean;
  start?: Date | string; // axios response object data property contains array with entries with deserialized property start as string representation of date object
  end?: Date | string; // axios response object data property contains array with entries with deserialized property end as string representation of date object
  desc?: undefined;
} 

const eventsArray : evtType[] = events as any;
const initEventsArr : evtType[] = [{
  id: 1,
  title: "Drop-in",
  start : moment("2023-12-13T07:00:00").toDate(),
  end: moment("2023-12-13T08:00:00").toDate()
}]

function assertsIsEvts(eventsArr): asserts eventsArr is evtType[]{
  if (!Array.isArray(eventsArr)) {
    throw new Error("eventsArr  isn't an array");
  }
  if (eventsArr.length === 0) {
    return;
  }
  eventsArr.forEach((evt) => {
    if (!('title' in evt)) {
      throw new Error("evt doesn't contain title");
    }
    if (typeof evt.title !== 'string') {
      throw new Error('title is not a string');
    }
    if (!('start' in evt)) {
      throw new Error("evt doesn't contain start");
    }
    if ( typeof evt.start.toString()!== 'string') {
      throw new Error('start is not a datestring');
    }
    if (!('end' in evt)) {
      throw new Error("evt doesn't contain end");
    }
    if ( typeof evt.end.toString() !== 'string') {
      throw new Error('end is not a datestring');
    }
  });
}

function Selectable(props) {
  const { localizer } = props
  const [myEvents, setEvents] = useState<evtType[]>(initEventsArr)
  const {
    tc,
    tm,
    i18n: { language },
    translateLabel
  } = useTranslation();
  const langFromReduxStore=useSelector((state: ReduxState)=>state.locale.language)

  async function getAxiousRecordsList() : Promise<evtType[]> {
    const axiosResp = await api.resourceAction({
      resourceId:"nf_event",
      actionName:"list",
      });
    const axiousData = axiosResp.data;  
    console.log("/src/admin/index ",axiousData)
    return  axiousData.records.map(record => {
      if (record.params && record.params.startmills && record.params.endmills){
        const startNum = parseInt(record.params.startmills.toString());
        const endNum = parseInt(record.params.endmills.toString());
        const obj : evtType= {
          title : record.params.title,
          start :  moment(startNum).toDate(),
          end:  moment(endNum).toDate()
          };
        return obj; 
      } else return {};
       
    });
  }

  useEffect(() => {
    api.getPage<evtType[]>({ pageName: 'SelectCalExample2' }).then((res) => {
      console.log(" big-cal-page res.data json string",JSON.stringify(res.data));
      const resEvts = res.data; // res.data contains string representation of dates (start and end properties)!!!
      const convEvts = resEvts.map(prEv => {
        const obj = {
          title : prEv.title.replace(/<\/?[^>]+(>|$)/g, "\n"),
          start :  moment(prEv.start).toDate(),
          end:  moment(prEv.end).toDate()
          };
        return obj;  
      });
      assertsIsEvts(resEvts)
      setEvents(convEvts)
    });
    /* getAxiousRecordsList().then((result)=>{
      assertsIsEvts(result);
      setEvents(result)
    }); */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  
  const { openModal, closeModal } = useModal()
  const [startEndObj,setStartEnd]= useState({start:new Date(),end: new Date()});
  type PickTimeFormProps = { 
    start?: Date,
    end? : Date, 
    handleModalSaveEvt: (title:string,start: Date,end: Date)=>void
  }

  const modalProps: ModalProps = {
    variant: 'primary',
    label: 'Create event',
    icon: 'Calendar',
    title: 'Define event parameters',
    subTitle: 'Insert title',
    buttons: [
        { label: 'Cancel', onClick: closeModal }, 
        { label: 'Save', color: 'danger' , type: "submit"}],
    onClose : closeModal,
    onOverlayClick : closeModal,
    children: PickTimeModalForm({
      start: startEndObj.start,
      end: startEndObj.end,
      handleModalSaveEvt: saveModalEvt,
    })
  }
  
  function activateModal(shModal: boolean, start: Date,end : Date){
    setStartEnd({start: start,end: end});
    console.log("big-cal-page activateModal shModal,modalProps",shModal,modalProps);
    openModal({modalProps: modalProps})
  }

  function saveModalEvt(title:string,start: Date,end: Date){
    console.log("big-cal-page title,start,end",title,start,end);
    const startMillsNum = parseInt(start.getTime().toString());
    const endMillsNum = parseInt(end.getTime().toString());
    if (title) {
      setEvents((prev) => [...prev,{ start, end, title }]);
      api.getPage<evtType[]>({
        pageName: 'SelectCalExample2',
        method: 'post',
        data : { startmills: startMillsNum, endmills: endMillsNum, title }
      })
    }
  }

  const handleSelectSlot = useCallback(
    /* ({ start, end }) => {
      const title = window.prompt('New Event name')
      const startMillsNum = parseInt(start.getTime().toString());
      const endMillsNum = parseInt(end.getTime().toString());
      console.log("big-cal-page typeof startMillsNum",typeof startMillsNum);
      if (title) {
        setEvents((prev) => [...prev,{ start, end, title }]);
        api.resourceAction({
          resourceId : "nf_event" ,
          actionName: "new",
          data : { startmills: startMillsNum, endmills: endMillsNum, title }
        })
      }
    } */
    ({ start, end }) => {
      const title = null // window.prompt('New Event name')
      activateModal(true, start,end) // 
      const startMillsNum = parseInt(start.getTime().toString());
      const endMillsNum = parseInt(end.getTime().toString());
      //console.log("big-cal-page typeof startMillsNum",typeof startMillsNum);
      if (title) {
        setEvents((prev) => [...prev,{ start, end, title }]);
        api.getPage<evtType[]>({
          pageName: 'SelectCalExample2',
          method: 'post',
          data : { startmills: startMillsNum, endmills: endMillsNum, title }
        })
      }
    } 
  ,[setEvents])
  

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  )
  

  return (
    <Fragment>
      <DemoLink fileName="selectable">
        <strong>
          {translateLabel("BigCalHeaderMsg")}
        </strong>
      </DemoLink>
      
      <div style={{ height: "95vh" }}>
        <Calendar
        {...props}
          defaultView={Views.WEEK}
          events={myEvents}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>
    </Fragment>
  )
}

/* Selectable.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
} */

export default function SelectableCal(props){
  return <Selectable {...props} />
}
