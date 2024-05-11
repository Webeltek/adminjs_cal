import { menu } from '../../../admin/index.js';
import { THUMB } from '../../../admin/components.bundler.js';
import { useEnvironmentVariableToDisableActions } from '../../../admin/features/useEnvironmentVariableToDisableActions.js';
import { ResourceFunction } from '../../../admin/types/index.js';
import { ProdARModel } from '../models/index.js';

export const CreateProdARResource: ResourceFunction<typeof ProdARModel> = () => ({
  resource: ProdARModel,
  features: [useEnvironmentVariableToDisableActions()],
  options: {
    navigation: menu.mongoose,
    properties: {
      _id: {
        isTitle: false,
      },
      title: {
        isTitle : true
      },
      content: {
        type: 'richtext',
      },
      exposed: {
        type : 'boolean',
        components: {
          list: THUMB,
        },
      },
    },
  },
});