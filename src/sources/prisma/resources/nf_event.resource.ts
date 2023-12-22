import { menu } from '../../../admin/index.js';
import { MILLS_TO_HOUR , STRIP_HTML_TAG } from '../../../admin/components.bundler.js';
import { useEnvironmentVariableToDisableActions } from '../../../admin/features/useEnvironmentVariableToDisableActions.js';
import { ResourceFunction } from '../../../admin/types/index.js';
import { client, dmmf } from '../config.js';

export const CreateNfEventResource: ResourceFunction<{
  model: typeof dmmf.modelMap.nf_event;
  client: typeof client;
}> = () => ({
  resource: {
    model: dmmf.modelMap.nf_event,
    client,
  },
  features: [useEnvironmentVariableToDisableActions()],
  options: {
    navigation: menu.prisma,
    properties: {
      title : {
        type : "string",
        components : {
          list : STRIP_HTML_TAG,
          props : {
            stripHtmlTag : "enableStripHtmlTag"
          }
        }
      },
      startmills : {
        isDisabled : true,
        type : "string",
        components : {
          list : MILLS_TO_HOUR,
        },
        props : {
          typeMills : "start"
        }
      },
      endmills : {
        isDisabled : true,
        type : "string",
        components : {
          list : MILLS_TO_HOUR,
        },
        props : {
          typeMills : "end"
        }
      } 
    },
  },
});
