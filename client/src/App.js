
import './App.css';
import DashboardLayoutSlots from './componants/dash';
//  call the react router dom to wrap all the app inside it 
import { BrowserRouter ,Route,Routes } from 'react-router-dom';
import Register from './componants/register';
import Login from './componants/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayoutSlots />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>

    </BrowserRouter>
    // <DashboardLayoutSlots />
  );
}

export default App;
