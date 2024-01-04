import type { PropsWithChildren } from 'react';
import { BoxProps } from '../../atoms/box/index.js';
import type { VariantType } from '../../theme.js';
/**
 * Props passed to DropDownItem
 * Extends {@link BoxProps}
 *
 * @memberof DropDown
 * @extends BoxProps
 */
export type DropDownItemProps = PropsWithChildren & BoxProps & {
    colorVariant?: VariantType;
    onClick?: (e: Event) => void;
};
/**
 * @component
 * @private
 */
export declare const DropDownItem: any;
export default DropDownItem;
