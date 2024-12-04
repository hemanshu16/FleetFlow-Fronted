import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TripPage from './pages/TripPage';
import AppLayout from './pages/AppLayout';
import ClientPage from './pages/Clientpage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            path="/trips"
            element={<TripPage />}
          />
       
        <Route
            path="/client"
            element={<ClientPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
