import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-cyan-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <img
            src="https://uttirna.in/img/Logo.png"
            alt="Logo"
            className="h-12 w-12"
          />
          <h1 className="text-xl font-semibold tracking-wide">UTTIRNA</h1>
        </div>

        {/* Hamburger Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link to="/add-welcome-image" className="hover:text-gray-200 transition">Welcome</Link>
          <Link to="/reporting-time" className="hover:text-gray-200 transition">Reporting Time</Link>
          <Link to="/roll-no-allotment" className="hover:text-gray-200 transition">Roll No Allotment</Link>
          <Link to="/invoice-format" className="hover:text-gray-200 transition">Invoice Format</Link>
          <Link to="/" className="hover:text-gray-200 transition">Dashboard</Link>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 font-medium">
          <Link to="/add-welcome-image" className="block hover:text-gray-200">Welcome</Link>
          <Link to="/reporting-time" className="block hover:text-gray-200">Reporting Time</Link>
          <Link to="/roll-no-allotment" className="block hover:text-gray-200">Roll No Allotment</Link>
          <Link to="/invoice-format" className="block hover:text-gray-200">Invoice Format</Link>
          <Link to="/" className="block hover:text-gray-200">Dashboard</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
