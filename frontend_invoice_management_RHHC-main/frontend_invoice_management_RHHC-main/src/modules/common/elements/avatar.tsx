// @ts-expect-error - temporary fix

/* eslint-disable */
import { forwardRef } from 'react';
import type { AvatarProps as MuiAvatarProps } from '@mui/material';
import { Avatar as MuiAvatar } from '@mui/material';
import { generateHSLColor } from '../helpers/hsl';

interface AvatarProps extends Omit<MuiAvatarProps, 'children'> {
  children: string;
}

const getInitials = (text: string) => {
  const parts = text.split(' ');
  // let initials = '';

  // for (const item of parts) {
  //   if (item.length > 0 && item !== '') {
  //     initials += item[0];
  //   }
  // }

  return text ? text.charAt(0).toUpperCase() : '-';
};

/** A `MuiAvatar` wrapper which generates random background color according to text */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, sx, ...rest }, ref) => {
    if (children) {
      return (
        <MuiAvatar
          sx={{ backgroundColor: generateHSLColor(children), ...sx }}
          ref={ref}
          {...rest}
        >
          {children ? getInitials(children) : undefined}
        </MuiAvatar>
      );
    }

    return <MuiAvatar ref={ref} sx={sx} {...rest} />;
  },
);

export default Avatar;
