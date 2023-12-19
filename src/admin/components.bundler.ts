import { ComponentLoader, OverridableComponent } from 'adminjs';
import path from 'path';
import * as url from 'url';
import MillsToHour from './components/mills-to-hour.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (url: string, componentName: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

export const override = (url: string, componentName: OverridableComponent): string =>
  componentLoader.override(componentName, path.join(__dirname, url));

/**
 * Overridable components
 */
override('components/top-bar', 'Version');
override('components/login', 'Login');
override('components/sidebar-resource-section', 'SidebarResourceSection');

/**
 * Common components
 */
export const PRODUCTS_LIST = add('components/products-list', 'ProductList');
export const DONT_TOUCH_THIS_ACTION = add('components/dont-touch-this-action', 'CustomAction');
export const DETAILED_STATS = add('components/detailed-stats', 'DetailedStats');
export const THUMB = add('components/thumb', 'Thumb');
export const MILLS_TO_HOUR = add('components/mills-to-hour', 'MillsToHour');
export const STRIP_HTML_TAG = add('components/strip-html-tag','StripHtmlTag');

/**
 * Pages
 */
export const CUSTOM_PAGE = add('pages/custom-page', 'CustomPage');
export const DESIGN_SYSTEM_PAGE = add('pages/design-system-examples/index', 'DesignSystemPage');
export const BIG_CAL_PAGE = add('pages/big-cal-page/big-cal-entry','SelectCalExample2');
