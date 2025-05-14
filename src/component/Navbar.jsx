import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-200">Dashboard</Link>
          
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
