import { css } from '@styled-components';
import { ButtonGroupProps } from './button-group.types.js';
export declare const BUTTON_IN_GROUP_CLASS_NAME: string;
export declare const buttonMargin: (props: Pick<ButtonGroupProps, 'size'>) => any;
export declare const hasHandler: (props: any) => ReturnType<typeof css> | string;
export declare const hasLabel: (props: any) => ReturnType<typeof css> | string;
export declare const StyledSingleButton: any;
export declare const StyledDropDownItemAction: any;
export declare const StyledButtonGroup: any;
