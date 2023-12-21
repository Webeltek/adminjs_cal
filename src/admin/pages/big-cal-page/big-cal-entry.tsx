import React , { FC, useState , useMemo} from 'react'
import { SelectCal }  from './big-cal-components/index.js'
import { CalendarProps } from 'react-big-calendar'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import { AdminJSLocalesConfig, useTranslation , ReduxState} from 'adminjs'
import 'moment-timezone'
import { useSelector , useDispatch} from 'react-redux'

const cultures = ['en','nb'];
const lang = {
  en: null,
  nb: {
    date : "Dato",
    time: "Tid",
    allDay: "Hele dagen",
    yesterday: "I går",
    week: 'Uke',
    work_week: 'Arbeidsuke',
    day: 'Dag',
    month: 'Måned',
    previous: 'Forrige',
    next: 'Neste',
    today: 'I dag',
    agenda: 'Agenda',

    showMore: (total) => `+${total} lengre`,
  }
}

const SelectCalExample2: FC = (props : CalendarProps) => {
  const {
    tc,
    tm,
    i18n: { language },
  } = useTranslation();
  const langFromReduxState = useSelector((state: ReduxState)=>state.locale.language);

  //moment.tz.setDefault('Europe/Paris')
  moment.locale(language);
  const localizer = momentLocalizer(moment)
  const culture = language;

  const { messages, defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: moment().toDate(),
      scrollToTime: moment("1970-01-01T06:00:00").toDate(),
      messages: lang[culture],
    }),
    [culture]
  )

  return (
    <SelectCal 
    {...props} 
    localizer={localizer} 
    culture={culture}
    messages={messages}
    defaultDate={defaultDate}
    scrollToTime={scrollToTime}/>
    );
}

export default SelectCalExample2;