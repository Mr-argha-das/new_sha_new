import { ReactNode } from 'react';
import { SvgIcon } from '@mui/material';

export interface BreadcrumbItemType {
  /** Title for the breadcrumb */
  name: string;

  /** Custom content we want to show for the Breadcrumb Item */
  content?: ReactNode;

  icon?: typeof SvgIcon;

  href?: string;

  onClick?: () => void;
}
