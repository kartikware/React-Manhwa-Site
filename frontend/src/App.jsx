import './css/App.css';
import React from "react";
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
  const [resetHomeCallback, setResetHomeCallback] = React.useState(null);

  return (
    <div>
      {/* Pass the resetHomeCallback to NavBar */}
      <NavBar onHomeClick={resetHomeCallback} />
      <main className="main-content">
        <Routes>
          {/* Pass setResetHomeCallback to Home */}
          <Route
            path="/"
            element={<Home setResetHomeCallback={setResetHomeCallback} />}
          />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;