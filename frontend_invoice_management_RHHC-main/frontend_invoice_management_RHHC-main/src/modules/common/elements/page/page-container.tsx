import { Box, BoxProps } from '@mui/material';
import type { ReactNode } from 'react';

interface ContainerProps extends BoxProps {
  children: ReactNode;
}

const PageContainer = ({ children, sx, ...rest }: ContainerProps) => {
  return (
    <Box component="section" sx={{ px: 4, py: 4, ...sx }} {...rest}>
      {children}
    </Box>
  );
};

export default PageContainer;
