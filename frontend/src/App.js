import React from 'react';
import Home from "./Components/Home/Home";
import LoginPage from "./Components/LoginForm/LoginPage";
import Floor from "./Components/Floors/Floor";
import Booking from "./Components/Home/Booking";
import AdminPage from "./Components/AdminPanel/AdminPage"
import MyBookings from "./Components/Home/MyBookings";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;