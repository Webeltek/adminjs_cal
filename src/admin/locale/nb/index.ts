import type { LocaleTranslations } from 'adminjs';

import common from './common.json' assert { type: 'json' };
import Complicated from './complicated.json' assert { type: 'json' };
import components from './components.json' assert { type: 'json' };
import pages from './pages.json' assert { type: 'json' };
import Person from './person.json' assert { type: 'json' };
import { menu } from '../../../admin/index.js';

const noLocale: LocaleTranslations = {
  ...common,
  ...components,
  ...pages,
  "labels.Mongoose Users": "Mongoose Brukere",
  "labels.Admin": "Admin",
  "labels.User": "Bruker",
  "labels.Category": "Kategori",
  "labels.Article" : "Artikel",
  "labels.Comment" : "Kommentar",
  "labels.Complicated" : "Komplisert", 
  "labels.crypto-database" : "Crypto Database", 
  "labels.kanbanBoard" : "Kanban Board" ,
  "labels.stats": "Status",
  "pages.designSystemExamples":"Design System Eksempel",
  "buttons.contactUs": "Kontakt oss",
  labels: {
    nf_user: "Bruker",
    nf_event: "Event",
    nf_room: "Rom",
    nf_payment: "Betaling"
  },
  resources: {
    nf_event: {
      properties : {
        title : "Titel",
        startmills: "Start",
        endmills: "Stop",
        ou : "Org."
      }
    },
    nf_room: {
      properties: {
        title: "Titel",
        row: "Rad"
      }
    },
    Complicated,
    Person,
    products: {
      properties: {
        categoryId: 'Kategori',
      },
    },
  },
};

export default noLocale;
