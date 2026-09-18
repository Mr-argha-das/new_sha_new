import type { MenuProps as MuiMenuProps } from '@mui/material';
import { Menu as MuiMenu } from '@mui/material';
import type { MouseEvent, ReactElement } from 'react';
import { Children, cloneElement, useState } from 'react';
import MenuContext from './context';

export interface MenuProps extends Omit<MuiMenuProps, 'open' | 'onClose'> {
  id: string;

  target: ReactElement;
}

const Menu = ({ id, target, children, ...rest }: MenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuId = `${id}-menu`;
  const targetId = `${id}-target`;

  return (
    <MenuContext.Provider value={{ close: handleClose }}>
      {cloneElement(target, {
        id: targetId,
        'aria-controls': open ? menuId : undefined,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        onClick: handleClick,
      })}
      <MuiMenu
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorEl}
        id={menuId}
        onClose={handleClose}
        open={open}
        {...rest}
      >
        {Children.map(children, (child) =>
          cloneElement(child as ReactElement, {
            onClick: () => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- MenuItem can have it's own `onClick`
              (child as ReactElement | undefined)?.props?.onClick?.();

              if (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- `preventCloseOnClick` may present on the MenuItem
                (child as ReactElement | undefined)?.props?.preventCloseOnClick
              ) {
                /** If `preventCloseOnClick` is explicitly set to `true`, we don't need to close the menu on item click */
                return;
              }

              handleClose();
            },
          }),
        )}
      </MuiMenu>
    </MenuContext.Provider>
  );
};

export default Menu;
