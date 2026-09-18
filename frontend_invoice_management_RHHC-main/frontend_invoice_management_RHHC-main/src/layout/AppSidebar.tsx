'use client';
import { useAuth } from '@/context/AuthContext';
import { getFullFileUrl } from '@/modules/common/helpers/helper';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AssignmentIcon, SpaceDashboardRoundedIcon } from '../../packages/ui/icons';
import { useSidebar } from '../context/SidebarContext';
import { ChevronDownIcon, HorizontaLDots } from '../icons/index';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    permission?: string;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <SpaceDashboardRoundedIcon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Dashboard',
    path: '/',
  },
  {
    icon: <AssignmentIcon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Lead Management',
    path: '/lead-management',
    subItems: [
      {
        name: 'Leads',
        path: '/lead',
        pro: false,
        permission: 'lead-management/lead:read',
      },
    ],
  },

  {
    icon: <AccountCircleIcon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Customer Management',
    path: '/customer',
    subItems: [
      {
        name: 'Customers',
        path: '/customer',
        pro: false,
        permission: 'user-management/user:read',
      },
    ],
  },
  {
    icon: <ReceiptIcon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Invoice Management',
    path: '/invoice-management',
    subItems: [
      {
        name: 'Invoices',
        path: '/invoice',
        pro: false,
        permission: 'invoice-management/invoice:read',
      },
    ],
  },
  {
    icon: <Inventory2Icon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Masters',
    path: '/product-management',
    subItems: [
      {
        name: 'Products',
        path: '/product',
        pro: false,
        permission: 'product-management/product:read',
      },
      {
        name: 'Services',
        path: '/service',
        pro: false,
        permission: 'product-management/service:read',
      },
    ],
  },
  {
    icon: <AccountCircleIcon sx={{ color: '#1447e6', fontSize: '20px' }} />,
    name: 'Staff Management',
    path: '/staff',
    subItems: [
      {
        name: 'Staff',
        path: '/staff',
        pro: false,
        permission: 'user-management/user:read',
      },
      {
        name: 'Tasks',
        path: '/staff/task',
        pro: false,
        permission: 'user-management/staff-task:read',
      },
      {
        name: 'Pay Slips',
        path: '/staff/pay-slip',
        pro: false,
        permission: 'user-management/staff-pay-slip:read',
      },
      {
        name: 'Experience Categories',
        path: '/staff-experience-category',
        pro: false,
        permission: 'user-management/staff-experience-category:read',
      },
    ],
  },

];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user, accountSettings } = useAuth();

  const menuPermission = user ? JSON.parse(user.menu_map || '{}') : '';

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: 'main' | 'others',
  ) => {
    return (
      <ul className="flex flex-col gap-4">
        {navItems.map((nav, index) => {
          // Secure sub-items first
          const visibleSubItems = nav.subItems?.filter((item) =>
            hasPermission(item.permission),
          );
          
          // If the parent nav has subItems but none are visible, skip it
          if (
            nav.subItems &&
            (!visibleSubItems || visibleSubItems.length === 0)
          ) {
            return null;
          }

          // For non-subItems (single link), check permission
          if (
            !nav.subItems &&
            nav.permission &&
            !hasPermission(nav.permission)
          ) {
            return null;
          }

          return (
            <li key={nav.name}>
              {visibleSubItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? 'menu-item-active'
                    : 'menu-item-inactive'
                    } cursor-pointer ${!isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start'
                    }`}
                >
                  <span
                    className={` ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? 'rotate-180 text-brand-500'
                        : ''
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    href={nav.path}
                    className={`menu-item group ${isActive(nav.path)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                      }`}
                  >
                    <span
                      className={`${isActive(nav.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className={`menu-item-text`}>{nav.name}</span>
                    )}
                  </Link>
                )
              )}

              {/* SubItems Rendering */}
              {visibleSubItems && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : '0px',
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {visibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`menu-dropdown-item ${isActive(subItem.path)
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                            }`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                                  } menu-dropdown-badge `}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? 'menu-dropdown-badge-active'
                                  : 'menu-dropdown-badge-inactive'
                                  } menu-dropdown-badge `}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const hasPermission = (permissionKey?: string) => {
    if (!permissionKey) return true; // visible if no permission is set

    // Remove trailing `:read` or `:write` etc., and extract base permission key
    const [key] = permissionKey.split(':');
    return menuPermission?.[key]?.includes('r'); // check for read access
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ['main', 'others'].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
          }`}
      >
        <Link href="/" className="lg:block hidden">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                loading="lazy"
                className="dark:hidden"
                src={
                  accountSettings?.logo
                    ? getFullFileUrl(accountSettings?.logo as string)
                    : ''
                }
                alt="Logo"
                width={150}
                height={40}
                style={{
                  minWidth: '150px',
                  minHeight: '40px',
                  maxWidth: '250px',
                  maxHeight: '60px',
                }}
              />
            </>
          ) : (
            <Image
                loading="lazy"
              src={
                accountSettings?.logo
                  ? getFullFileUrl(accountSettings?.logo as string)
                  : ''
              }
              alt="Logo"
              width={32}
                height={32}
                style={{
                  width: '32px',
                  height: '40px',
                }}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start'
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ''
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
