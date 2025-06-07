import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
