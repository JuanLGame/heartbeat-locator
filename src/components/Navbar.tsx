
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Heart, path: '/', label: 'Alarma' },
    { icon: User, path: '/profile', label: 'Perfil' },
    { icon: Settings, path: '/settings', label: 'Ajustes' }
  ];

  return (
    <>
      {/* Top header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 glass-panel h-16 flex items-center justify-center max-w-md mx-auto"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <h1 className="text-xl font-semibold tracking-tight">Love Alarm</h1>
      </motion.header>
      
      {/* Bottom navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-50 glass-panel h-16 max-w-md mx-auto"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex h-full items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-1/3 h-full transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`size-5 mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-xs ${isActive ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 w-10 h-1 bg-primary rounded-t-md"
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </motion.nav>
    </>
  );
};
