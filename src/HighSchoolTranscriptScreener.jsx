import React, { useState, useEffect } from 'react';
import { getGradeConversion, getHighSchoolScales, getDefaultHighSchoolScale } from './high_school_conversions_database';
import { processPDFWithN8n, performHealthCheck } from './n8n_integration';

const HighSchoolTranscriptScreener = ({ onBack }) => {
  const [selectedScale, setSelectedScale] = useState(getDefaultHighSchoolScale());
  const [formData, setFormData] = useState({
    studentName: '',
    schoolName: '',
    subjects: {
      'G11S1': [],
      'G11S2': [],
      'G12S1': [],
      'G12S2': [],
    },
  });
  const [results, setResults] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [pdfStatus, setPdfStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [n8nStatus, setN8nStatus] = useState(null);

  const scales = getHighSchoolScales();

  useEffect(() => {
    const saved = localStorage.getItem('byuh_hs_entries');
    if (saved) setSavedEntries(JSON.parse(saved));
    
    // Check n8n health
    performHealthCheck().then(health => {
      setN8nStatus(health);
    });
  }, []);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setPdfStatus({
      type: 'processing',
      message: '⏳ Processing PDF with n8n... This may take 10-30 seconds.',
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        // Call n8n workflow
        const result = await processPDFWithN8n(arrayBuffer, file);

        if (!result.success) {
          setPdfStatus({
            type: 'error',
            message: `❌ ${result.error}`,
          });
          setIsProcessing(false);
          return;
        }

        // Determine if digital or camera
        if (result.pdfType === 'digital') {
          setPdfStatus({
            type: 'digital',
            message: `✅ Digital PDF detected! Found ${result.gradeCount} grades.`,
          });
        } else {
          setPdfStatus({
            type: 'camera',
            message: `✅ Camera photo processed! Found ${result.gradeCount} grades.`,
          });
        }

        // Auto-populate grades if found
        if (result.grades && result.grades.length > 0) {
          const newSubjects = result.grades.slice(0, 10).map((g, idx) => ({
            name: `Subject ${idx + 1}`,
            grade: g.toString(),
          }));
          setFormData(prev => ({
            ...prev,
            subjects: { ...prev.subjects, 'G11S1': newSubjects },
          }));
        }
      } catch (error) {
        console.error('Error processing PDF:', error);
        setPdfStatus({
          type: 'error',
          message: '❌ Error processing PDF. Please enter grades manually.',
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addSubject = (semester) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [semester]: [...prev.subjects[semester], { name: '', grade: '' }],
      },
    }));
  };

  const updateSubject = (semester, index, field, value) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects[semester]];
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
      return { ...prev, subjects: { ...prev.subjects, [semester]: updatedSubjects } };
    });
  };

  const deleteSubject = (semester, index) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [semester]: prev.subjects[semester].filter((_, i) => i !== index),
      },
    }));
  };

  const calculateResults = () => {
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
    
    const gpaPoints = allGrades
      .map(g => {
        const conversion = getGradeConversion(selectedScale.id, g);
        return conversion ? conversion.gpa : null;
      })
      .filter(g => g !== null);
    
    if (gpaPoints.length === 0) {
      alert('Could not convert grades for this scale.');
      return;
    }
    
    const avgGPA = (gpaPoints.reduce((a, b) => a + b) / gpaPoints.length).toFixed(2);
    const letterGrade = gpaToLetter(avgGPA);

    setResults({
      avgGrade,
      avgGPA,
      letter: letterGrade,
      gradeScale: selectedScale.name,
    });
  };

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

  const saveEntry = () => {
    if (!results) return;
    
    const entry = {
      id: Date.now(),
      studentName: formData.studentName,
      schoolName: formData.schoolName,
      scale: selectedScale.name,
      avgGrade: results.avgGrade,
      avgGPA: results.avgGPA,
      letter: results.letter,
      timestamp: new Date().toLocaleString(),
    };
    
    const newEntries = [entry, ...savedEntries];
    setSavedEntries(newEntries);
    localStorage.setItem('byuh_hs_entries', JSON.stringify(newEntries));
    alert('Entry saved!');
  };

  const copyToClipboard = () => {
    if (!results) return;
    
    const text = `
High School Transcript Evaluation
Student: ${formData.studentName || 'N/A'}
School: ${formData.schoolName || 'N/A'}
Scale: ${results.gradeScale}

Average Grade: ${results.avgGrade}
GPA: ${results.avgGPA}
Letter Grade: ${results.letter}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const newStudent = () => {
    if (window.confirm('Clear all data for a new student?')) {
      setFormData({ studentName: '', schoolName: '', subjects: { G11S1: [], G11S2: [], G12S1: [], G12S2: [] } });
      setResults(null);
      setPdfStatus(null);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #c69214',
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '0',
    },
    headerButtons: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: '#666',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    newStudentButton: {
      backgroundColor: '#c69214',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    statusIndicator: {
      fontSize: '12px',
      padding: '5px 10px',
      borderRadius: '4px',
      backgroundColor: 'rgba(255,255,255,0.2)',
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
      overflowY: 'auto',
    },
    sidebarTitle: {
      color: '#ba0c2f',
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '15px',
    },
    scaleButton: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'left',
    },
    scaleButtonActive: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      borderColor: '#ba0c2f',
    },
    formContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      overflowY: 'auto',
    },
    formTitle: {
      color: '#ba0c2f',
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Montserrat, sans-serif',
    },
    pdfUpload: {
      border: '2px dashed #ba0c2f',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: isDragging ? '#ffe6e6' : '#fff',
    },
    pdfStatus: {
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '4px',
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      fontSize: '14px',
    },
    semesterTitle: {
      color: '#333',
      fontSize: '16px',
      fontWeight: '600',
      marginTop: '20px',
      marginBottom: '10px',
    },
    subjectRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      alignItems: 'center',
    },
    subjectInput: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    gradeInput: {
      width: '80px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    addButton: {
      backgroundColor: '#c69214',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '10px',
    },
    calculateButton: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '20px',
      width: '100%',
    },
    resultsPanel: {
      width: '350px',
      backgroundColor: '#ba0c2f',
      color: 'white',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      overflowY: 'auto',
    },
    resultsValue: {
      fontSize: '48px',
      fontWeight: '700',
      margin: '20px 0',
    },
    resultsLabel: {
      fontSize: '14px',
      opacity: '0.9',
    },
    copyButton: {
      backgroundColor: 'white',
      color: '#ba0c2f',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '15px',
      width: '100%',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>High School Transcript Screener</h1>
        <div style={styles.headerButtons}>
          {n8nStatus && (
            <div style={styles.statusIndicator}>
              {n8nStatus.n8n ? '✅ n8n Ready' : '⚠️ n8n Down'}
            </div>
          )}
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <button style={styles.newStudentButton} onClick={newStudent}>+ New Student</button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Grade Scale</div>
          {scales.map(scale => (
            <button
              key={scale.id}
              style={{
                ...styles.scaleButton,
                ...(selectedScale?.id === scale.id ? styles.scaleButtonActive : {}),
              }}
              onClick={() => setSelectedScale(scale)}
            >
              {scale.name}
            </button>
          ))}
        </div>

        {/* Center Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Enter Grades</h2>

          <div style={styles.pdfUpload}>
            <label>📄 Upload Transcript PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              disabled={isProcessing}
              style={{ marginTop: '10px', width: '100%' }}
            />
          </div>

          {pdfStatus && (
            <div style={styles.pdfStatus}>{pdfStatus.message}</div>
          )}

          <input
            type="text"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            style={styles.input}
          />

          {/* Grade 11 */}
          <h3 style={styles.semesterTitle}>Grade 11 - Semester 1</h3>
          {formData.subjects.G11S1.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G11S1', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G11S1', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G11S1', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G11S1')}>+ Add Subject</button>

          <h3 style={styles.semesterTitle}>Grade 11 - Semester 2</h3>
          {formData.subjects.G11S2.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G11S2', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G11S2', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G11S2', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G11S2')}>+ Add Subject</button>

          {/* Grade 12 */}
          <h3 style={styles.semesterTitle}>Grade 12 - Semester 1</h3>
          {formData.subjects.G12S1.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G12S1', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G12S1', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G12S1', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G12S1')}>+ Add Subject</button>

          <h3 style={styles.semesterTitle}>Grade 12 - Semester 2</h3>
          {formData.subjects.G12S2.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G12S2', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G12S2', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G12S2', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G12S2')}>+ Add Subject</button>

          <button style={styles.calculateButton} onClick={calculateResults}>Calculate GPA</button>
        </div>

        {/* Right Results */}
        {results && (
          <div style={styles.resultsPanel}>
            <div style={styles.resultsLabel}>Average Grade</div>
            <div style={styles.resultsValue}>{results.avgGrade}</div>

            <div style={styles.resultsLabel}>GPA</div>
            <div style={styles.resultsValue}>{results.avgGPA}</div>

            <div style={styles.resultsLabel}>Letter Grade</div>
            <div style={styles.resultsValue}>{results.letter}</div>

            <div style={styles.resultsLabel}>{results.gradeScale}</div>

            <button style={styles.copyButton} onClick={copyToClipboard}>📋 Copy to Clipboard</button>
            <button style={styles.copyButton} onClick={saveEntry}>💾 Save Entry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighSchoolTranscriptScreener;

const HighSchoolTranscriptScreener = ({ onBack }) => {
  const [selectedScale, setSelectedScale] = useState(getDefaultHighSchoolScale());
  const [formData, setFormData] = useState({
    studentName: '',
    schoolName: '',
    subjects: {
      'G11S1': [],
      'G11S2': [],
      'G12S1': [],
      'G12S2': [],
    },
  });
  const [results, setResults] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [pdfStatus, setPdfStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const scales = getHighSchoolScales();

  useEffect(() => {
    const saved = localStorage.getItem('byuh_hs_entries');
    if (saved) setSavedEntries(JSON.parse(saved));
  }, []);

  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        
        const hasTextLayer = textContent.items && 
                            textContent.items.length > 0 && 
                            textContent.items.some(item => item.str && item.str.trim().length > 0);

        if (!hasTextLayer) {
          setPdfStatus({
            type: 'camera',
            message: '📸 Camera photo detected. Please enter grades manually below.',
          });
        } else {
          setPdfStatus({
            type: 'digital',
            message: '✅ Digital PDF detected! Extracting data...',
          });

          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const pageData = await pdf.getPage(i);
            const content = await pageData.getTextContent();
            fullText += content.items.map(item => item.str).join(' ') + ' ';
          }

          const grades = extractGradesFromText(fullText);
          if (grades.length > 0) {
            const newSubjects = grades.slice(0, 5).map(g => ({ name: `Subject`, grade: g.toString() }));
            setFormData(prev => ({
              ...prev,
              subjects: { ...prev.subjects, 'G11S1': newSubjects }
            }));
          }
        }
      } catch (error) {
        console.error('PDF processing error:', error);
        setPdfStatus({
          type: 'error',
          message: '❌ Error reading PDF. Please enter grades manually.',
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractGradesFromText = (text) => {
    const grades = [];
    const patterns = [
      /\b([6-9]\d|100)(?:\s|,|$)/g,
      /\b([1-5]\.\d{1,2})\b/g,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const grade = parseFloat(match[1]);
        if (grade > 0 && grade <= 100 && !grades.includes(grade)) {
          grades.push(grade);
        }
      }
    });

    return [...new Set(grades)].sort((a, b) => b - a).slice(0, 15);
  };

  const addSubject = (semester) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [semester]: [...prev.subjects[semester], { name: '', grade: '' }],
      },
    }));
  };

  const updateSubject = (semester, index, field, value) => {
    setFormData(prev => {
      const updatedSubjects = [...prev.subjects[semester]];
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
      return { ...prev, subjects: { ...prev.subjects, [semester]: updatedSubjects } };
    });
  };

  const deleteSubject = (semester, index) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [semester]: prev.subjects[semester].filter((_, i) => i !== index),
      },
    }));
  };

  const calculateResults = () => {
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
    
    const gpaPoints = allGrades
      .map(g => {
        const conversion = getGradeConversion(selectedScale.id, g);
        return conversion ? conversion.gpa : null;
      })
      .filter(g => g !== null);
    
    if (gpaPoints.length === 0) {
      alert('Could not convert grades for this scale.');
      return;
    }
    
    const avgGPA = (gpaPoints.reduce((a, b) => a + b) / gpaPoints.length).toFixed(2);
    const letterGrade = gpaToLetter(avgGPA);

    setResults({
      avgGrade,
      avgGPA,
      letter: letterGrade,
      gradeScale: selectedScale.name,
    });
  };

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

  const saveEntry = () => {
    if (!results) return;
    
    const entry = {
      id: Date.now(),
      studentName: formData.studentName,
      schoolName: formData.schoolName,
      scale: selectedScale.name,
      avgGrade: results.avgGrade,
      avgGPA: results.avgGPA,
      letter: results.letter,
      timestamp: new Date().toLocaleString(),
    };
    
    const newEntries = [entry, ...savedEntries];
    setSavedEntries(newEntries);
    localStorage.setItem('byuh_hs_entries', JSON.stringify(newEntries));
    alert('Entry saved!');
  };

  const copyToClipboard = () => {
    if (!results) return;
    
    const text = `
High School Transcript Evaluation
Student: ${formData.studentName || 'N/A'}
School: ${formData.schoolName || 'N/A'}
Scale: ${results.gradeScale}

Average Grade: ${results.avgGrade}
GPA: ${results.avgGPA}
Letter Grade: ${results.letter}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const newStudent = () => {
    if (window.confirm('Clear all data for a new student?')) {
      setFormData({ studentName: '', schoolName: '', subjects: { G11S1: [], G11S2: [], G12S1: [], G12S2: [] } });
      setResults(null);
      setPdfStatus(null);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #c69214',
    },
    headerTitle: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '0',
    },
    backButton: {
      backgroundColor: '#c69214',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    newStudentButton: {
      backgroundColor: '#c69214',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginLeft: '10px',
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
      overflowY: 'auto',
    },
    sidebarTitle: {
      color: '#ba0c2f',
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '15px',
    },
    scaleButton: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      border: '2px solid #e0e0e0',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'left',
    },
    scaleButtonActive: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      borderColor: '#ba0c2f',
    },
    formContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      overflowY: 'auto',
    },
    formTitle: {
      color: '#ba0c2f',
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Montserrat, sans-serif',
    },
    semesterTitle: {
      color: '#333',
      fontSize: '16px',
      fontWeight: '600',
      marginTop: '20px',
      marginBottom: '10px',
    },
    subjectRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      alignItems: 'center',
    },
    subjectInput: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    gradeInput: {
      width: '80px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    addButton: {
      backgroundColor: '#c69214',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '10px',
    },
    calculateButton: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '700',
      marginTop: '20px',
      width: '100%',
    },
    pdfUpload: {
      border: '2px dashed #ba0c2f',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: isDragging ? '#ffe6e6' : '#fff',
    },
    pdfStatus: {
      padding: '12px',
      marginBottom: '15px',
      borderRadius: '4px',
      backgroundColor: '#e8f5e9',
      color: '#2e7d32',
      fontSize: '14px',
    },
    resultsPanel: {
      width: '350px',
      backgroundColor: '#ba0c2f',
      color: 'white',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      overflowY: 'auto',
    },
    resultsValue: {
      fontSize: '48px',
      fontWeight: '700',
      margin: '20px 0',
    },
    resultsLabel: {
      fontSize: '14px',
      opacity: '0.9',
    },
    copyButton: {
      backgroundColor: 'white',
      color: '#ba0c2f',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '15px',
      width: '100%',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>High School Transcript Screener</h1>
        <div>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <button style={styles.newStudentButton} onClick={newStudent}>+ New Student</button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Grade Scale</div>
          {scales.map(scale => (
            <button
              key={scale.id}
              style={{
                ...styles.scaleButton,
                ...(selectedScale?.id === scale.id ? styles.scaleButtonActive : {}),
              }}
              onClick={() => setSelectedScale(scale)}
            >
              {scale.name}
            </button>
          ))}
        </div>

        {/* Center Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Enter Grades</h2>

          <div style={styles.pdfUpload}>
            <label>📄 Upload Transcript PDF (Or drag and drop anywhere)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
              style={{ marginTop: '10px', width: '100%' }}
            />
          </div>

          {pdfStatus && (
            <div style={styles.pdfStatus}>{pdfStatus.message}</div>
          )}

          <input
            type="text"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            style={styles.input}
          />

          {/* Grade 11 */}
          <h3 style={styles.semesterTitle}>Grade 11 - Semester 1</h3>
          {formData.subjects.G11S1.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G11S1', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G11S1', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G11S1', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G11S1')}>+ Add Subject</button>

          <h3 style={styles.semesterTitle}>Grade 11 - Semester 2</h3>
          {formData.subjects.G11S2.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G11S2', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G11S2', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G11S2', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G11S2')}>+ Add Subject</button>

          {/* Grade 12 */}
          <h3 style={styles.semesterTitle}>Grade 12 - Semester 1</h3>
          {formData.subjects.G12S1.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G12S1', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G12S1', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G12S1', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G12S1')}>+ Add Subject</button>

          <h3 style={styles.semesterTitle}>Grade 12 - Semester 2</h3>
          {formData.subjects.G12S2.map((subject, idx) => (
            <div key={idx} style={styles.subjectRow}>
              <input
                type="text"
                placeholder="Subject"
                value={subject.name}
                onChange={(e) => updateSubject('G12S2', idx, 'name', e.target.value)}
                style={styles.subjectInput}
              />
              <input
                type="number"
                placeholder="Grade"
                value={subject.grade}
                onChange={(e) => updateSubject('G12S2', idx, 'grade', e.target.value)}
                style={styles.gradeInput}
              />
              <button style={styles.deleteButton} onClick={() => deleteSubject('G12S2', idx)}>Delete</button>
            </div>
          ))}
          <button style={styles.addButton} onClick={() => addSubject('G12S2')}>+ Add Subject</button>

          <button style={styles.calculateButton} onClick={calculateResults}>Calculate GPA</button>
        </div>

        {/* Right Results */}
        {results && (
          <div style={styles.resultsPanel}>
            <div style={styles.resultsLabel}>Average Grade</div>
            <div style={styles.resultsValue}>{results.avgGrade}</div>

            <div style={styles.resultsLabel}>GPA</div>
            <div style={styles.resultsValue}>{results.avgGPA}</div>

            <div style={styles.resultsLabel}>Letter Grade</div>
            <div style={styles.resultsValue}>{results.letter}</div>

            <div style={styles.resultsLabel}>{results.gradeScale}</div>

            <button style={styles.copyButton} onClick={copyToClipboard}>📋 Copy to Clipboard</button>
            <button style={styles.copyButton} onClick={saveEntry}>💾 Save Entry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighSchoolTranscriptScreener;
