import {
  Breadcrumbs as MuiBreadcrumbs,
  BreadcrumbsProps as MuiBreadcrumbsProps,
} from '@mui/material';
import BreadcrumbItem from './breadcrumb-item';
import { BreadcrumbItemType } from './types';
import { HomeRoundedIcon } from '../../../../../packages/ui/icons';

interface BreadcrumbsProps extends Pick<MuiBreadcrumbsProps, 'sx'> {
  items: BreadcrumbItemType[];

  /** Do we want to show Home Breadcrumb item ? */
  home?: boolean;
}

const Breadcrumbs = ({ items, home = true, ...rest }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs {...rest}>
      {home && (
        <BreadcrumbItem
          data={{ href: '/', icon: HomeRoundedIcon, name: 'Home' }}
        />
      )}

      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          data={item}
          active={index === items.length - 1}
        />
      ))}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
