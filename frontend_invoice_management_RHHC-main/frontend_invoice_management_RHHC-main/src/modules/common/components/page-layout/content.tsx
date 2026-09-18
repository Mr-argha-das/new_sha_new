import { Box, BoxProps, Theme as MaterialTheme } from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import { OverridableComponent } from '@mui/types';

const PageLayoutContent: OverridableComponent<
  BoxTypeMap<{}, 'div', MaterialTheme>
> = ({ children, sx, ...rest }: BoxProps) => {
  return (
    <Box sx={{ flex: 1, ...sx }} {...rest}>
      {children}
    </Box>
  );
};

export default PageLayoutContent;
