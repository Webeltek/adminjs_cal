import { FieldError } from 'react-hook-form';
import { Box , BoxProps} from '@adminjs/design-system'
import React from 'react';

type Props = {
  fieldError: FieldError | undefined;
};
export function ValidationError({ fieldError }: Props) {
  if (!fieldError) {
    return null;
  }
  return (
    <Box  color="error" >
      {fieldError.message}
    </Box>
  );
}