/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionRequest, AdminJSOptions , ApiClient} from 'adminjs';
import { CUSTOM_PAGE, DESIGN_SYSTEM_PAGE , BIG_CAL_PAGE} from '../components.bundler.js';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import { evtType } from './big-cal-page/big-cal-components/big-cal-page.js';
import { method } from 'lodash';

async function backendConvPrismaEvents(request: ActionRequest) : Promise<evtType[]> {
  const client = new PrismaClient();
  if (request.method==="post" && request.payload.insert){
      console.log("index backendConvPrismaEvents post  request.payload",request.payload);
      const toInsertEvt = { startmills: request.payload.startmills, endmills: request.payload.endmills, title : request.payload.title}
      const postedEvt = await client.nf_event.create({data: toInsertEvt});
      return [postedEvt];
  } else if (request.method==="post" && request.payload.delete){
    console.log("index backendConvPrismaEvents post  request.payload",request.payload);
    const deletedEvt = await client.nf_event.delete({
      where: {
        id: request.payload.id  
      },
    });
    return [deletedEvt];
  } else if(request.method==="get"){
      const prismaEvents = await client.nf_event.findMany();
      const prismaEvts = prismaEvents.map(prEv => {
        if (prEv.title && prEv.startmills && prEv.endmills){
          const startNum = parseInt(prEv.startmills.toString());
          const endNum = parseInt(prEv.endmills.toString());
          const obj : evtType= {
            id: prEv.id,
            title : prEv.title,
            start :  moment(startNum).toDate(),
            end:  moment(endNum).toDate()
            };
          return obj; 
        } else return {};
      });
      return prismaEvts;
  }

}

const pages: AdminJSOptions['pages'] = {
  customPage: {
    component: CUSTOM_PAGE,
    icon: 'File',
    handler: async (request, response, context) => {
      return {
        text: 'I am fetched from the backend',
      };
    },
  },
  designSystemExamples: {
    component: DESIGN_SYSTEM_PAGE,
    icon: 'Layout',
  },
  SelectCalExample2: {
    component : BIG_CAL_PAGE,
    icon : 'Calendar',
    handler: async (request : ActionRequest, response, context) => {
      return backendConvPrismaEvents(request);
    }
  }
};

export default pages;
