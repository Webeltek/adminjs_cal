import { Box } from '@adminjs/design-system';
import { flat, BasePropertyProps } from 'adminjs';
import React, { FC } from 'react';

const StripHtmlTag : FC = ( props: BasePropertyProps) => {
    const { record, property } = props;
    const stripHtmlStringProp = property.props.stripHtmlTag;
    const strippedTitle = record.params.title.replace(/<\/?[^>]+(>|$)/g, "\n");
    return ( record.params && <Box>{strippedTitle}</Box> );
  } 
  
export default StripHtmlTag;