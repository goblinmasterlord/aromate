import React, { useState } from 'react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-900">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
