import { menu } from '../../../admin/index.js';
import { useEnvironmentVariableToDisableActions } from '../../../admin/features/useEnvironmentVariableToDisableActions.js';
import { ResourceFunction } from '../../../admin/types/index.js';
import { client, dmmf } from '../config.js';

export const CreateNfUserResource: ResourceFunction<{
  model: typeof dmmf.modelMap.nf_user;
  client: typeof client;
}> = () => ({
  resource: {
    model: dmmf.modelMap.nf_user,
    client,
  },
  features: [useEnvironmentVariableToDisableActions()],
  options: {
    navigation: menu.prisma,
    listProperties : ['id','user_email','user_is_logged_in','user_confirmed','ou'],
    filterProperties: ['id','user_email','user_is_logged_in','user_confirmed','ou'],
    editProperties: ['user_email','user_is_logged_in','user_confirmed','ou'],
    showProperties: ['id','user_email','user_is_logged_in','user_confirmed','ou']
  },
});
