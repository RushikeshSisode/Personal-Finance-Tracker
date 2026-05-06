import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ important import
import Header from './component/Header';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import './App.css';
import "antd/dist/reset.css";   

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* ✅ Toast container placed here */}
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default App;
