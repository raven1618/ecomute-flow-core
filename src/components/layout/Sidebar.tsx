
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Clipboard, 
  Package2, 
  ShoppingCart, 
  Bell, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Presupuestos', path: '/presupuestos', icon: <FileText size={20} /> },
    { name: 'Órdenes de Obra', path: '/wo', icon: <Clipboard size={20} /> },
    { name: 'Almacén', path: '/warehouse', icon: <Package2 size={20} /> },
    { name: 'Compras', path: '/purchase', icon: <ShoppingCart size={20} /> },
    { name: 'Alertas', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Usuarios', path: '/users', icon: <Users size={20} /> },
    { name: 'Configuración', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div 
      className={`bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out relative ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-bold text-xl text-white">ECOMUTE</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-sidebar-accent ml-auto"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/60">
            ECOMUTE Core v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
