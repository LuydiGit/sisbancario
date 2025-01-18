import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'

import Login from './Login/Login';
import CreateClient from './CreateClient/CreateClient';
import Home from './Home/Home';
import AreaPix from './AreaPix/AreaPix';

function App() {

  return (
    <Router>
      <Routes>

          <Route path="/Login" element={<Login />} />
          <Route path="/CreateClient" element={<CreateClient />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/AreaPix" element={<AreaPix />} />

      </Routes>
    </Router>
  )
}

export default App
