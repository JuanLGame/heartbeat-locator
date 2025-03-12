
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 p-4 pb-6">
      <motion.div 
        className="glass-panel mx-auto rounded-full max-w-md p-2 flex justify-around"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <NavLink to="/" active={isActive('/')}>
          <Home size={24} />
        </NavLink>
        
        {user ? (
          <>
            <NavLink to="/profile" active={isActive('/profile')}>
              <User size={24} />
            </NavLink>
            
            <NavLink to="/settings" active={isActive('/settings')}>
              <Settings size={24} />
            </NavLink>
          </>
        ) : (
          <NavLink to="/auth" active={isActive('/auth')}>
            <LogOut size={24} />
          </NavLink>
        )}
      </motion.div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link to={to} className="relative block p-2">
      <div className={`transition-colors ${active ? 'text-alarm' : 'text-foreground/60'}`}>
        {children}
      </div>
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 mx-auto h-1 w-1/2 bg-alarm rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

export default Navbar;
