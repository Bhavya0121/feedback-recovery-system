import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Is URL par Stars dikhenge */}
        <Route path="/survey/:token" element={<SurveyForm />} />
        
        {/* Default Home Page */}
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Feedback Portal</h1>
            <p>Please use the link from your email.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;