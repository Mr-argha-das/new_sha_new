// @ts-expect-error - temporary fix

/* eslint-disable */
import type { LinkProps as MuiLinkProps } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import { ReactNode } from 'react';

export interface LinkProps
  extends NextLinkProps,
    Omit<MuiLinkProps, 'as' | 'href'> {
  label?: string;

  children?: ReactNode;

  tenantId?: boolean;
}

const Link = ({
  label,
  children,
  href,
  sx,
  tenantId = false,
  width = '100%',
  ...rest
}: LinkProps) => {
  const mergedSx = {
    textDecoration: children ? 'none !important' : 'inherit',
    ...sx,
  };

  return (
    <NextLink
      href={href}
      passHref
      style={{ textDecoration: 'none', width: width }}
    >
      <MuiLink sx={mergedSx} {...rest} component="span">
        {label || children}
      </MuiLink>
    </NextLink>
  );
};

export default Link;
