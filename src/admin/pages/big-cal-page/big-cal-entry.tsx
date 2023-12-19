import React , { FC, useState } from 'react'
import { SelectCal }  from './big-cal-components/index.js'
import { CalendarProps } from 'react-big-calendar'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import { AdminJSLocalesConfig, useTranslation } from 'adminjs'

const SelectCalExample2: FC = (props : CalendarProps) => {
  const {
    tc,
    tm,
    i18n: { language },
  } = useTranslation();

  const langString = 'nb';
  moment.locale(language);
  const localizer = momentLocalizer(moment)
  return (
    <SelectCal {...props} localizer={localizer}/>
    );
}

export default SelectCalExample2;