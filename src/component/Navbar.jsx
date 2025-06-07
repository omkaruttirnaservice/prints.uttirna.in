import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="space-x-6">

          <Link to="/add-welcome-image" className="hover:text-gray-200">Welcome</Link>
          <Link to="/reporting-time" className="hover:text-gray-200">Reporting Time</Link>
          <Link to="/roll-no-allotment" className="hover:text-gray-200">Roll No Allotment</Link>
          <Link to="/invoice-format" className="hover:text-gray-200">Invoice Format</Link>
          <Link to="/" className="hover:text-gray-200">Dashboard</Link>




        </div>
      </div>
    </nav>
  );
};

export default Navbar;
