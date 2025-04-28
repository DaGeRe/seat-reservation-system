import React from 'react';
import Home from './Components/Home/Home';
import LoginPage from './Components/LoginForm/LoginPage';
import Floor from './Components/Floors/Floor';
import Booking from './Components/Home/Booking';
import AdminPage from './Components/AdminPanel/AdminPage';
import MyBookings from './Components/Home/MyBookings';
import ManageSeries from './Components/Series/ManageSeries';
import CreateSeries from './Components/Series/CreateSeries';
import FreeDesks from './Components/Home/FreeDesks';
import './i18n';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RoomSearch from './Components/Home/RoomSearch';
import Colleagues from './Components/Home/Colleagues';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/floor" element={<Floor />}></Route>
          <Route path="/desks" element={<Booking />}></Route>
          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/mybookings" element={<MyBookings />}></Route>
          <Route path="/manageseries" element={<ManageSeries />}></Route>
          <Route path="/createseries" element={<CreateSeries />}></Route>
          <Route path='/freedesks' element={<FreeDesks/>}/>
          <Route path='/roomSearch' element={<RoomSearch/>}/>
          <Route path='/colleagues' element={<Colleagues/>}/>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;