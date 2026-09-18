import type { MenuItemProps as MuiMenuItemProps } from '@mui/material';
import { MenuItem as MuiMenuItem } from '@mui/material';

interface MenuItemProps extends MuiMenuItemProps {
  /** Set this to "true" when you don't want to close the menu on click of Item */
  preventCloseOnClick?: boolean;
}

const MenuItem = (props: MenuItemProps) => {
  return <MuiMenuItem {...props} />;
};

export default MenuItem;
