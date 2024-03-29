import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/sag_logo.png';
import './App.css';

import { useState, useEffect } from 'react';

function Hello() {

  const [status, setStatus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9100/status')
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
          setStatus(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
 }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
        <h1>Electron - React - Node(Express)</h1>
        <div><p>Response received from Express App</p></div>
        <div><p>{status.response}</p></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
