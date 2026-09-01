import React, { useState } from 'react';
import LandingPage from './LandingPage';
import HighSchoolTranscriptScreener from './HighSchoolTranscriptScreener';
import TranscriptScreener_Beautiful from './TranscriptScreener_Beautiful';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleSelectHighSchool = () => {
    setCurrentPage('high-school');
  };

  const handleSelectCollege = () => {
    setCurrentPage('college');
  };

  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage 
          onSelectHighSchool={handleSelectHighSchool}
          onSelectCollege={handleSelectCollege}
        />
      )}

      {currentPage === 'high-school' && (
        <HighSchoolTranscriptScreener onBack={handleBack} />
      )}

      {currentPage === 'college' && (
        <TranscriptScreener_Beautiful onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
