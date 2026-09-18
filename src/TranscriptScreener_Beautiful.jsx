import React, { useState, useEffect } from 'react';
import { SCHOOL_CONVERSIONS, getGPAConversion } from './school_conversions_database';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { processTranscriptImageWithOllama, checkOllamaStatus } from './ollama_integration';

// Electron loads the app from a file:// origin, where window.location.origin is
// the literal string "null". pdfjs-dist's same-origin check for its worker always
// fails there, routing it through a cross-origin Blob-wrapper path that hangs
// indefinitely with no fallback in this environment. Registering the worker module
// on window.pdfjsWorker makes pdfjs-dist skip the separate Worker thread and run
// parsing on the main thread instead - the officially supported bundler pattern.
window.pdfjsWorker = pdfjsWorker;

/**
 * BYUH TRANSCRIPT SCREENER - BEAUTIFUL DASHBOARD
 * ✨ Official BYUH Branding
 * ✨ Modern Dashboard Layout
 * ✨ Professional Design
 */

// School Database (60+ schools)
const SCHOOL_DATABASE = {
  schools: [
    // BATCH 1
    { id: 'adamson', name: 'Adamson University', abbr: 'AdU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'aiim', name: 'Adventist International Institute', abbr: 'AIIM', scales: ['0-100'] },
    { id: 'arellano', name: 'Arellano University', abbr: 'AU', scales: ['0-100'] },
    { id: 'act', name: 'Asian College of Technology', abbr: 'ACT', scales: ['1.0-5.0 Inverse'] },
    { id: 'aim', name: 'Asian Institute of Management', abbr: 'AIM', scales: ['0-100', '1.0-5.0'] },
    { id: 'addu', name: 'Ateneo de Davao University', abbr: 'AdDU', scales: ['0-100'] },
    { id: 'amu', name: 'Ateneo de Manila University', abbr: 'ADMU', scales: ['0-100'] },
    { id: 'anu', name: 'Ateneo de Naga University', abbr: 'ANU', scales: ['0-100'] },
    { id: 'brokenshire', name: 'Brokenshire College', abbr: 'BC', scales: ['0-100'] },
    { id: 'cspc', name: 'Camarines Sur Polytechnic College', abbr: 'CSPC', scales: ['1.0-5.0 Inverse'] },
    { id: 'cghc', name: 'Chinese General Hospital College', abbr: 'CGHC', scales: ['1.0-5.0 Inverse'] },
    { id: 'csl', name: 'Colegio de San Lorenzo', abbr: 'CSL', scales: ['0-100'] },
    { id: 'dlsu', name: 'De La Salle University', abbr: 'DLSU', scales: ['0-4.0', '0-100'] },
    { id: 'delmark', name: 'Delmark Global Academy', abbr: 'DGA', scales: ['1.0-5.0 Inverse'] },
    { id: 'dwu', name: 'Divine Word University', abbr: 'DWU', scales: ['1.0-5.0 Inverse'] },
    { id: 'dhvsu', name: 'Don Honorio Ventura State University', abbr: 'DHVSU', scales: ['1.0-5.0 Inverse'] },
    { id: 'eac', name: 'Emilio Aguinaldo College', abbr: 'EAC', scales: ['1.0-5.0 Inverse'] },
    { id: 'feu', name: 'Far Eastern University', abbr: 'FEU', scales: ['4.0 Scale', '1.0-5.0 Inverse'] },
    { id: 'kcp', name: "King's College of the Philippines", abbr: 'KCP', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'lnu', name: 'Lyceum Northwestern University', abbr: 'LNU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'mapua', name: 'Mapua University', abbr: 'MAPUA', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'mmsu', name: 'Mariano Marcos State University', abbr: 'MMSU', scales: ['1.0-4.0'] },
    { id: 'medina', name: 'Medina College', abbr: 'MC', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'miriam', name: 'Miriam College', abbr: 'MC', scales: ['0-100', '1.0-5.0'] },
    { id: 'plvu', name: 'Pamantasan ng Lungsod ng Valenzuela University', abbr: 'PLVU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'pnu', name: 'Philippine Normal University', abbr: 'PNU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'pwu', name: "Philippine Women's University", abbr: 'PWU', scales: ['0-100', '1.0-5.0'] },
    { id: 'pcc', name: 'Pines City Colleges', abbr: 'PCC', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'pup', name: 'Polytechnic University of the Philippines', abbr: 'PUP', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'qcpu', name: 'Quezon City Polytechnic University', abbr: 'QCPU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'slu', name: 'Saint Louis University', abbr: 'SLU', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'spua', name: 'Saint Paul University', abbr: 'SPUA', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'sjdl', name: 'San Juan de Letran College', abbr: 'SJDL', scales: ['0-100'] },
    { id: 'su', name: 'Silliman University', abbr: 'SU', scales: ['3.8-4.0', '0-100'] },
    { id: 'swu', name: 'Southwestern University', abbr: 'SWU', scales: ['1.0-3.0'] },
    { id: 'stpaul', name: 'St. Paul College of Manila', abbr: 'SPCM', scales: ['0-100'] },
    { id: 'ssc', name: "St. Scholastica's College", abbr: 'SSC', scales: ['0-100'] },
    { id: 'unci', name: 'Unciano Colleges Inc.', abbr: 'UCI', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'uc', name: 'University of Cebu', abbr: 'UC', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'umak', name: 'University of Makati', abbr: 'UMAK', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'unp', name: 'University of Northern Philippines', abbr: 'UNP', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'upc', name: 'University of Pangasinan', abbr: 'UPan', scales: ['0-100'] },
    { id: 'uphsd', name: 'University of Perpetual Help System DALTA', abbr: 'UPHSD', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'usc', name: 'University of San Carlos', abbr: 'USC', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'usjr', name: 'University of San Jose - Recoletos', abbr: 'USJR', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'ust', name: 'University of Santo Tomas', abbr: 'UST', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'usm', name: 'University of Southern Mindanao', abbr: 'USM', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'uc2', name: 'University of the Cordilleras', abbr: 'UC', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'ue', name: 'University of the East', abbr: 'UE', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'uplb', name: 'University of the Philippines (Los Banos)', abbr: 'UPLB', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'uv', name: 'University of the Visayas', abbr: 'UV', scales: ['0-100', '1.0-5.0 Inverse'] },
    { id: 'xu', name: 'Xavier University', abbr: 'XU', scales: ['0-100', '1.0-5.0 Inverse'] },
  ]
};

// Grade conversion functions
// Helper function to convert GPA number to letter
const gpaToLetter = (gpa) => {
  const num = parseFloat(gpa);
  if (num >= 3.85) return 'A';
  if (num >= 3.5) return 'A-';
  if (num >= 3.15) return 'B+';
  if (num >= 2.85) return 'B';
  if (num >= 2.5) return 'B-';
  if (num >= 2.15) return 'C+';
  if (num >= 1.85) return 'C';
  if (num >= 1.5) return 'C-';
  if (num >= 1.15) return 'D+';
  if (num >= 0.85) return 'D';
  if (num >= 0.5) return 'D-';
  return 'F';
};

// Main Component
const TranscriptScreener = ({ onBack }) => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedScale, setSelectedScale] = useState(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    gradeScale: '',
    academicYear: new Date().getFullYear().toString(),
    subjects: { 'G11S1': [], 'G11S2': [], 'G12S1': [], 'G12S2': [] },
  });
  const [results, setResults] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [pdfStatus, setPdfStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ollamaSetupStatus, setOllamaSetupStatus] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('byuh_entries');
    if (saved) setSavedEntries(JSON.parse(saved));
    
    // Check if Ollama is already available (e.g. left running from a prior
    // session). If not, that just means setup hasn't finished yet - it does
    // NOT mean setup failed, so this must never set ollamaAvailable to false
    // itself. Whether setup succeeds or fails is reported definitively via
    // the progress events below.
    checkOllamaStatus().then(isAvailable => {
      if (isAvailable) setOllamaAvailable(true);
    });

    // Listen for first-run Ollama/model setup progress from the main process
    // (downloading/installing Ollama, pulling the vision model can take a while).
    const unsubscribe = window.electron?.onOllamaProgress?.((data) => {
      setOllamaSetupStatus(data);
      if (data.stage === 'ready') {
        setOllamaAvailable(true);
      } else if (data.stage === 'error') {
        setOllamaAvailable(false);
      }
    });
    return () => unsubscribe?.();
  }, []);

  const convertGradeToGPA = (grade, schoolId) => {
    if (!schoolId) return null;
    const conversion = getGPAConversion(schoolId, grade, null);
    return conversion ? conversion.gpa : null;
  };

  // Renders a PDF page to a JPEG data URL for the AI vision model. Every page
  // goes through this same path - whether it's a typed PDF or a scanned photo,
  // the model reads pixels the same way, which is what lets one pipeline
  // handle both instead of maintaining separate typed-text and OCR code paths.
  const renderPageToImageBase64 = async (page) => {
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return dataUrl.split(',')[1] || null;
  };

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!ollamaAvailable) {
      setPdfStatus({
        type: 'error',
        message: ollamaAvailable === null
          ? '⏳ The AI reader is still starting up - please wait a moment and try again, or enter grades manually below.'
          : '❌ The AI reader is not available (see the status above). Please enter grades manually below.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;

        let pdf;
        try {
          pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        } catch (pdfError) {
          console.error('PDF load error:', pdfError);
          setPdfStatus({
            type: 'error',
            message: `❌ Failed to read PDF: ${pdfError.message}. Try a different PDF or enter grades manually.`,
          });
          return;
        }

        setIsProcessing(true);

        const allSubjects = [];
        let detectedSchool = null;
        let studentName = null;
        let pagesFailed = 0;

        for (let i = 1; i <= pdf.numPages; i++) {
          setPdfStatus({
            type: 'processing',
            message: `🤖 Reading page ${i} of ${pdf.numPages} with AI... this can take several minutes per page, please be patient.`,
          });

          try {
            const page = await pdf.getPage(i);
            const imageBase64 = await renderPageToImageBase64(page);
            if (!imageBase64) {
              pagesFailed++;
              continue;
            }

            const result = await processTranscriptImageWithOllama(imageBase64, SCHOOL_DATABASE.schools);
            if (result.success) {
              allSubjects.push(...result.subjects);
              if (!detectedSchool && result.detectedSchool) detectedSchool = result.detectedSchool;
              if (!studentName && result.studentName) studentName = result.studentName;
            } else {
              console.warn(`Page ${i} extraction failed:`, result.error);
              pagesFailed++;
            }
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError);
            pagesFailed++;
          }
        }

        setIsProcessing(false);

        if (allSubjects.length === 0) {
          setPdfStatus({
            type: 'error',
            message: '❌ The AI could not read any subjects/grades from this PDF. Please enter grades manually.',
          });
          return;
        }

        if (detectedSchool) {
          setSelectedSchool(detectedSchool);
          setFormData(prev => ({ ...prev, schoolName: detectedSchool.name }));
        }

        const newSubjects = allSubjects.map(s => ({
          name: s.name || 'Subject',
          grade: (s.grade ?? '').toString(),
        }));
        setFormData(prev => ({
          ...prev,
          subjects: { ...prev.subjects, 'G11S1': newSubjects },
        }));

        const warning = pagesFailed > 0 ? ` (${pagesFailed} page${pagesFailed === 1 ? '' : 's'} could not be read)` : '';
        setPdfStatus({
          type: 'success',
          message: `✅ AI read ${newSubjects.length} subject${newSubjects.length === 1 ? '' : 's'}${studentName ? ` for ${studentName}` : ''}${warning}. Please double-check every grade below before calculating - AI extraction is not perfect.`,
        });
      } catch (error) {
        console.error('PDF processing error:', error);
        setIsProcessing(false);
        setPdfStatus({
          type: 'error',
          message: `❌ Error reading PDF: ${error.message}. Please try again or enter grades manually.`,
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateResults = () => {
    if (!selectedSchool) {
      alert('Please select a school');
      return;
    }

    if (!selectedScale) {
      alert('Please select a grade scale');
      return;
    }

    const allGrades = [
      ...formData.subjects.G11S1.map(s => parseFloat(s.grade)),
      ...formData.subjects.G11S2.map(s => parseFloat(s.grade)),
      ...formData.subjects.G12S1.map(s => parseFloat(s.grade)),
      ...formData.subjects.G12S2.map(s => parseFloat(s.grade)),
    ].filter(g => !isNaN(g));

    if (allGrades.length === 0) {
      alert('Please add at least one grade');
      return;
    }

    const avgGrade = (allGrades.reduce((a, b) => a + b) / allGrades.length).toFixed(2);
    
    // Use school-specific conversions from database
    const gpaPoints = allGrades
      .map(g => convertGradeToGPA(g, selectedSchool.id))
      .filter(g => g !== null);
    
    if (gpaPoints.length === 0) {
      alert('Could not convert grades for this school. Please verify the grade values.');
      return;
    }
    
    const avgGPA = (gpaPoints.reduce((a, b) => a + b) / gpaPoints.length).toFixed(2);

    setResults({
      avgGrade,
      avgGPA,
      letter: gpaToLetter(avgGPA),
      gradeScale: selectedScale,
    });
  };

  const addSubject = (sem) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [sem]: [...prev.subjects[sem], { name: '', grade: '' }],
      },
    }));
  };

  const resetNewStudent = () => {
    if (window.confirm('Clear all data and start a new student?')) {
      setSelectedSchool(null);
      setSelectedScale(null);
      setResults(null);
      setPdfStatus(null);
      setFormData({
        schoolName: '',
        gradeScale: '',
        academicYear: new Date().getFullYear().toString(),
        subjects: { 'G11S1': [], 'G11S2': [], 'G12S1': [], 'G12S2': [] },
      });
    }
  };

  const copyToClipboard = () => {
    const text = `BYUH: The applicant has submitted a transcript from ${formData.schoolName} (${formData.academicYear}).

Grade Scale: ${results.gradeScale}
Average Grade: ${results.avgGrade}
US GPA and Letter Grade: ${results.avgGPA} or ${results.letter}`;
    
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const pdfFile = Array.from(files).find(f => f.type === 'application/pdf');
      if (pdfFile) {
        // Simulate file input change
        const event = { target: { files: [pdfFile] } };
        handlePDFUpload(event);
      } else {
        alert('⚠️ Please drop a PDF file');
      }
    }
  };

  const updateSubject = (sem, idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [sem]: prev.subjects[sem].map((s, i) => i === idx ? { ...s, [field]: value } : s),
      },
    }));
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <div>
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                alt="BYU HAWAII"
                style={styles.logoImg}
              />
              <h1 style={styles.title}>Transcript Screener</h1>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {onBack && (
                <button onClick={onBack} style={{...styles.newStudentBtn, backgroundColor: '#666', width: '120px'}}>
                  ← Back
                </button>
              )}
              {selectedSchool && (
                <button onClick={resetNewStudent} style={styles.newStudentBtn}>
                  ➕ New Student
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {ollamaSetupStatus && ollamaSetupStatus.stage !== 'ready' && (
        <div style={{
          padding: '10px 20px',
          backgroundColor: ollamaSetupStatus.stage === 'error' ? '#f8d7da' : '#fff3cd',
          color: ollamaSetupStatus.stage === 'error' ? '#721c24' : '#856404',
          textAlign: 'center',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          {ollamaSetupStatus.stage !== 'error' && <span className="spinner" />}
          {ollamaSetupStatus.message}
        </div>
      )}

      <div
        style={{...styles.mainContent, position: 'relative'}}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div style={styles.dragOverlay}>
            <div style={styles.dragContent}>
              📄 Drop PDF Here
            </div>
          </div>
        )}
        {/* LEFT SIDEBAR */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>School Selection</h2>
          
          <div style={styles.sidebarSection}>
            <label style={styles.label}>Choose School</label>
            <select
              onChange={(e) => {
                const school = SCHOOL_DATABASE.schools.find(s => s.id === e.target.value);
                setSelectedSchool(school);
                setSelectedScale(null);
                if (school) setFormData(prev => ({ ...prev, schoolName: school.name }));
              }}
              value={selectedSchool?.id || ''}
              style={styles.select}
            >
              <option value="">Select a school...</option>
              {SCHOOL_DATABASE.schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {selectedSchool && (
            <div style={styles.sidebarSection}>
              <label style={styles.label}>Grade Scale</label>
              <div style={styles.scaleGrid}>
                {selectedSchool.scales.map(scale => (
                  <button
                    key={scale}
                    onClick={() => {
                      setSelectedScale(scale);
                      setFormData(prev => ({ ...prev, gradeScale: scale }));
                    }}
                    style={{
                      ...styles.scaleBtn,
                      backgroundColor: selectedScale === scale ? '#ba0c2f' : '#f0f0f0',
                      color: selectedScale === scale ? 'white' : '#333',
                    }}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedScale && (
            <div style={styles.sidebarSection}>
              <p style={styles.selectedInfo}>
                <strong>{selectedSchool.name}</strong><br/>
                <small>Scale: {selectedScale}</small>
              </p>
            </div>
          )}

          {/* Saved entries */}
          {savedEntries.length > 0 && (
            <div style={styles.sidebarSection}>
              <h3 style={styles.savedTitle}>Saved ({savedEntries.length})</h3>
              <div style={styles.savedList}>
                {savedEntries.slice(-5).map((e, i) => (
                  <div key={i} style={styles.savedItem}>
                    <div style={styles.savedSchool}>{e.data.schoolName}</div>
                    <small>{e.timestamp}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER FORM */}
        {selectedScale && (
          <main style={styles.formArea}>
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Enter Grades</h2>

              {/* PDF Upload Section */}
              <div style={styles.pdfUploadSection}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: ollamaAvailable === true ? '#155724' : ollamaAvailable === false ? '#721c24' : '#856404',
                }}>
                  <span data-testid="ai-reader-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ollamaAvailable === true && '✅ AI Reader: Ready'}
                    {ollamaAvailable === false && '❌ AI Reader: Not available'}
                    {ollamaAvailable === null && (<><span className="spinner" /> AI Reader: Checking...</>)}
                  </span>
                  {ollamaAvailable === false && (
                    <button
                      onClick={() => {
                        setOllamaSetupStatus({ stage: 'starting-ollama', message: '🔄 Retrying AI setup...' });
                        window.electron?.retryOllamaSetup?.();
                      }}
                      style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        border: '1px solid #721c24',
                        borderRadius: '4px',
                        background: 'white',
                        color: '#721c24',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 Retry
                    </button>
                  )}
                </div>
                <label style={styles.pdfLabel}>
                  📄 Upload Transcript PDF (Or drag and drop anywhere)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  style={styles.fileInput}
                />
                <small style={styles.dragHint}>💡 Tip: You can drag a PDF file onto any part of the screen</small>
                {pdfStatus && (
                  <div data-testid="pdf-status" style={{
                    ...styles.pdfStatus,
                    backgroundColor: pdfStatus.type === 'success' ? '#d4edda' :
                                     pdfStatus.type === 'processing' ? '#fff3cd' : '#f8d7da',
                    color: pdfStatus.type === 'success' ? '#155724' :
                           pdfStatus.type === 'processing' ? '#856404' : '#721c24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    {pdfStatus.type === 'processing' && <span className="spinner" />}
                    {pdfStatus.message}
                  </div>
                )}
              </div>
              
              {['G11S1', 'G11S2', 'G12S1', 'G12S2'].map(sem => (
                <div key={sem} style={styles.semesterSection}>
                  <h3 style={styles.semesterTitle}>
                    {sem === 'G11S1' ? '11th Grade - Semester 1' : 
                     sem === 'G11S2' ? '11th Grade - Semester 2' :
                     sem === 'G12S1' ? '12th Grade - Semester 1' : '12th Grade - Semester 2'}
                  </h3>
                  {formData.subjects[sem].map((subj, idx) => (
                    <div key={idx} style={styles.gradeInput}>
                      <input
                        type="text"
                        placeholder="Subject"
                        value={subj.name}
                        onChange={(e) => updateSubject(sem, idx, 'name', e.target.value)}
                        style={styles.input}
                      />
                      <input
                        type="number"
                        placeholder="Grade"
                        value={subj.grade}
                        onChange={(e) => updateSubject(sem, idx, 'grade', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  ))}
                  <button onClick={() => addSubject(sem)} style={styles.addBtn}>+ Add Subject</button>
                </div>
              ))}

              <button onClick={calculateResults} style={styles.calculateBtn}>
                Calculate GPA
              </button>
            </div>
          </main>
        )}

        {/* RIGHT RESULTS */}
        {results && (
          <aside style={styles.resultsPanel}>
            <div style={styles.resultCard}>
              <h2 style={styles.resultTitle}>Results</h2>
              
              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Average Grade</span>
                <span style={styles.resultValue}>{results.avgGrade}</span>
              </div>

              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>US GPA</span>
                <span style={styles.resultValue}>{results.avgGPA}</span>
              </div>

              <div style={styles.resultItem}>
                <span style={styles.resultLabel}>Letter Grade</span>
                <span style={{...styles.resultValue, fontSize: '28px', color: '#ba0c2f'}}>
                  {results.letter}
                </span>
              </div>

              <div style={styles.summaryBox}>
                <p style={styles.summaryText}>
                  <strong>BYUH:</strong> The applicant has submitted a transcript from <strong>{formData.schoolName}</strong>.
                </p>
                <p style={styles.summaryText}>
                  <strong>Average Grade:</strong> {results.avgGrade}
                </p>
                <p style={styles.summaryText}>
                  <strong>US GPA and Letter Grade:</strong> {results.avgGPA} or {results.letter}
                </p>
              </div>

              <div style={styles.buttonGroup2}>
                <button onClick={copyToClipboard} style={styles.copyBtn}>📋 Copy Text</button>
                <button style={styles.exportBtn}>📥 Export to Excel</button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// STYLES - BYUH BRANDING
const styles = {
  container: {
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ba0c2f',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
    borderBottom: '3px solid #c69214',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newStudentBtn: {
    padding: '10px 15px',
    backgroundColor: '#c69214',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },
  dragOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(186, 12, 47, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  dragContent: {
    color: 'white',
    fontSize: '48px',
    fontWeight: '700',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '4px',
    marginBottom: '10px',
  },
  title: {
    margin: '0',
    fontSize: '32px',
    fontWeight: '700',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    gap: '20px',
    padding: '20px',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ba0c2f',
    marginBottom: '20px',
    marginTop: '0',
  },
  sidebarSection: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #ddd',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
    fontSize: '13px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '2px solid #ba0c2f',
    borderRadius: '4px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
  },
  scaleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scaleBtn: {
    padding: '10px',
    border: '2px solid #e0e0e0',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '12px',
  },
  selectedInfo: {
    backgroundColor: '#ba0c2f',
    color: 'white',
    padding: '12px',
    borderRadius: '4px',
    margin: '0',
    fontSize: '13px',
  },
  savedTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    marginTop: '0',
  },
  savedList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  savedItem: {
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '8px',
    border: '1px solid #ddd',
    fontSize: '12px',
  },
  savedSchool: {
    fontWeight: '600',
    color: '#ba0c2f',
  },
  formArea: {
    flex: 1,
    minHeight: '400px',
  },
  formCard: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '25px',
  },
  formTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#ba0c2f',
    marginTop: '0',
    marginBottom: '20px',
  },
  pdfUploadSection: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '25px',
    border: '2px dashed #ba0c2f',
  },
  pdfLabel: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#ba0c2f',
    fontSize: '13px',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
  },
  dragHint: {
    display: 'block',
    color: '#666',
    fontSize: '11px',
    fontStyle: 'italic',
    marginTop: '8px',
  },
  pdfStatus: {
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  semesterSection: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
  },
  semesterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '12px',
  },
  gradeInput: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '13px',
  },
  addBtn: {
    padding: '10px 15px',
    backgroundColor: '#c69214',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
  },
  calculateBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ba0c2f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '16px',
  },
  resultsPanel: {
    width: '300px',
    height: 'fit-content',
  },
  resultCard: {
    backgroundColor: '#ba0c2f',
    color: 'white',
    borderRadius: '8px',
    padding: '25px',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '0',
    marginBottom: '20px',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  resultLabel: {
    fontWeight: '600',
    fontSize: '13px',
  },
  resultValue: {
    fontSize: '20px',
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  summaryText: {
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0 0 10px 0',
  },
  buttonGroup2: {
    display: 'flex',
    gap: '10px',
  },
  copyBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#ffffff',
    color: '#ba0c2f',
    border: '2px solid #ffffff',
    borderRadius: '4px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
  },
  exportBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#c69214',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default TranscriptScreener;
