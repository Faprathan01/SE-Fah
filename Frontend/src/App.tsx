import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RidePage from './pages/admin/ride'; // Import RidePage component
import CreateRidePage from './pages/admin/ride/create';
import EditRidePage from './pages/admin/ride/edit';
import Ride from './pages/user/ride';
import Booking from './pages/user/ride/booking';
import StockPage from './pages/admin/stock';
import CreateStockPage from './pages/admin/stock/create';
import EditStockPage from './pages/admin/stock/edit';


function App() {
  return (
    <Routes>
      <Route path="/rides" element={<RidePage />} />
      <Route path="/createrides" element={<CreateRidePage />} />
      <Route path="/editrides/:id" element={<EditRidePage />} />
      <Route path="/homerides" element={<Ride />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/stocks" element={<StockPage />} />
      <Route path="/createstock" element={<CreateStockPage />} />
      <Route path="/editstock/:id" element={<EditStockPage />} />

    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
