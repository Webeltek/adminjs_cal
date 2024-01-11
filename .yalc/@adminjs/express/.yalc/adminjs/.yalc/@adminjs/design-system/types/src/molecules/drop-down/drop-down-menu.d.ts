import { PropsWithChildren } from 'react';
import { BoxProps } from '../../atoms/box/index.js';
import { DropDownStickProp } from './drop-down.js';
/**
 * Props passed to DropDownMenu element.
 * Extends {@link BoxProps}
 *
 * @memberof DropDown
 */
export type DropDownMenuProps = PropsWithChildren<BoxProps & {
    isVisible?: boolean;
    stick?: DropDownStickProp;
}>;
/**
 * @component
 * @private
 */
export declare const DropDownMenu: any;
export default DropDownMenu;
