import { Box , ValueGroup} from '@adminjs/design-system';
import { flat, BasePropertyProps , useTranslation} from 'adminjs';
import React, { FC } from 'react';
import {  dmmf } from '../../sources/prisma/config.js';
import  moment  from 'moment';

type startMillsProps = {
    title : string;
}

const MillsToHour: FC = (props: BasePropertyProps ) => {
    const { translateProperty } = useTranslation();
    const { record, property, where} = props;
    const params = record.params;
    if (property.props.typeMills){
      const timeStampType = property.props.typeMills === 'start'? 'start' : 'end';
      const convStartMills = timeStampType === 'start' ? params.startmills : params.endmills;
      let convDate = moment()
      if(convStartMills){
        convDate = moment(parseInt(convStartMills.toString()));
      }
      //const obj= Intl.DateTimeFormat('no-NO',{ weekday: 'short', year: '2-digit', month: '2-digit',day: '2-digit',hour:'2-digit',minute:'2-digit'});
      //console.log("mills-to-hour  property.props.typeMills", property.props.typeMills);
      if ( record.params && where === 'show'){
        return (
          <ValueGroup label={translateProperty(property.label, property.resourceId)}>
              <Box>{convDate.format("ddd, DD.MM.YY, HH:mm")}</Box> 
          </ValueGroup> 
          );
      } else if (record.params && where === 'list'){
        return (
          <Box>{convDate.format("ddd, DD.MM.YY, HH:mm")}</Box>
        )
      }
      
    }
    
}


export default MillsToHour;