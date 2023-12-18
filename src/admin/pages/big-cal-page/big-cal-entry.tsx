import React , { FC, useState } from 'react'
import { SelectCal }  from './big-cal-components/index.js'
import { CalendarProps } from 'react-big-calendar'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import { AdminJSLocalesConfig } from 'adminjs'

const langString = 'nb';
moment.locale(langString);
const localizer = momentLocalizer(moment)

const SelectCalExample2: FC = (props : CalendarProps) => {
  
  return (
    <SelectCal {...props} localizer={localizer}/>
    );
}

export default SelectCalExample2;