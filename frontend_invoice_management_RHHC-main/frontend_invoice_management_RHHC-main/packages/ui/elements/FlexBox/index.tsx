import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { CSSProperties } from 'react';

export interface FlexBoxProps
  extends Omit<BoxProps, 'alignItems' | 'justifyContent' | 'flexDirection'> {
  justify?: CSSProperties['justifyContent'];

  /** Defaults to "center" */
  align?: CSSProperties['alignItems'];

  direction?: CSSProperties['flexDirection'];
}

const FlexBox = ({
  justify,
  align = 'center',
  direction,
  ...rest
}: FlexBoxProps) => {
  return (
    <Box
      alignItems={align}
      display="flex"
      flexDirection={direction}
      justifyContent={justify}
      {...rest}
    />
  );
};

export default FlexBox;
