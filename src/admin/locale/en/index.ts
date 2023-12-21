import type { LocaleTranslations } from 'adminjs';

import common from './common.json' assert { type: 'json' };
import Complicated from './complicated.json' assert { type: 'json' };
import components from './components.json' assert { type: 'json' };
import pages from './pages.json' assert { type: 'json' };
import Person from './person.json' assert { type: 'json' };

const enLocale: LocaleTranslations = {
  ...common,
  ...components,
  ...pages,
  "labels.Admin": "Admin",
  "labels.User": "User",
  "labels.Category": "Category",
  "labels.Article" : "Article",
  "labels.Comment" : "Comment",
  "labels.Complicated" : "Complicated", 
  "labels.crypto-database" : "Crypto Database", 
  "labels.Mongoose Users":  "Mongoose Users",
  "labels.kanbanBoard" : "Kanban Board" ,
  "labels.stats": "Stats",
  "pages.designSystemExamples":"Design System Examples",
  "buttons.contactUs": "Contact Us",
  "labels.BigCalHeaderMsg": "Header message",
  "labels.SelectableSourceCode": "Link to selectable source code",
  labels: {
    nf_user: "User",
    nf_event: "Event",
    nf_room: "Room",
    nf_payment: "Payment"
  },
  resources: {
    nf_event: {
      properties : {
        startmills: "Start",
        endmills: "End",
        ou : "Org."
      }
    },
    Complicated,
    Person,
    products: {
      properties: {
        categoryId: 'Category',
      },
    },
  },
};

export default enLocale;
