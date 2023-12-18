import { menu } from '../../../admin/index.js';
import { useEnvironmentVariableToDisableActions } from '../../../admin/features/useEnvironmentVariableToDisableActions.js';
import { ResourceFunction } from '../../../admin/types/index.js';
import { client, dmmf } from '../config.js';

export const CreateNfRoomResource: ResourceFunction<{
  model: typeof dmmf.modelMap.nf_room;
  client: typeof client;
}> = () => ({
  resource: {
    model: dmmf.modelMap.nf_room,
    client,
  },
  features: [useEnvironmentVariableToDisableActions()],
  options: {
    navigation: menu.prisma,
  },
});
