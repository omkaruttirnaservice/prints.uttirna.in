import { Route, Routes } from 'react-router-dom';
import AddWelcomeImage from '../pages/AddWelcomeImage';
import Dashboard from '../component/Dashboard';
import ReportingTime from '../pages/ReportingTime';
import RollNoAllotment from '../pages/RollNoAllotment';

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Dashboard />} />
      <Route path="/add-welcome-image" element={<AddWelcomeImage />} />
        <Route path="/reporting-time" element={<ReportingTime />} />
         <Route path="/roll-no-allotment" element={<RollNoAllotment />} />
  
    </Routes>
  );
};

export default AppRoutes;
