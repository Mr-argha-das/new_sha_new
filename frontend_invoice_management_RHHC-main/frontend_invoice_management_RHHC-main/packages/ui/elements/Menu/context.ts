import { createContext, useContext } from 'react';

interface MenuContextType {
  /** Close the Menu */
  close: () => void;
}

const MenuContext = createContext<MenuContextType>({
  close: () => {},
});

export const useMenu = () => useContext(MenuContext);

export default MenuContext;
