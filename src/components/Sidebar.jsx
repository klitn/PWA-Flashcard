import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPlus, 
  FiTrendingUp, 
  FiBookOpen,
  FiSettings 
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Tạo Bộ Thẻ',
      href: '/create-deck',
      icon: FiPlus,
      current: location.pathname === '/create-deck'
    },
    {
      name: 'Thống Kê',
      href: '/statistics',
      icon: FiTrendingUp,
      current: location.pathname === '/statistics'
    },
    {
      name: 'Thư Viện',
      href: '/library',
      icon: FiBookOpen,
      current: location.pathname === '/library'
    },
    {
      name: 'Cài Đặt',
      href: '/settings',
      icon: FiSettings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="flex w-64 flex-col h-full">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h2 className="text-lg font-semibold text-gray-800">Home</h2>
        </div>
        
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;