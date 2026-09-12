/**
 * BYUH SCHOOL CONVERSION DATABASE
 * Extracted from official school grading scales
 * Each school has its EXACT conversion ranges
 */

export const SCHOOL_CONVERSIONS = {
  // BATCH 1 - ADAMSON & ATENEO
  adamson: {
    name: 'Adamson University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 93, max: 96, gpa: 3.7, letter: 'A-' },
      { min: 89, max: 92, gpa: 3.3, letter: 'B+' },
      { min: 85, max: 88, gpa: 3.0, letter: 'B' },
      { min: 82, max: 84, gpa: 2.7, letter: 'B-' },
      { min: 79, max: 81, gpa: 2.3, letter: 'C+' },
      { min: 76, max: 78, gpa: 2.0, letter: 'C' },
      { min: 73, max: 75, gpa: 1.7, letter: 'C-' },
      { min: 70, max: 72, gpa: 1.3, letter: 'D' },
      { min: 0, max: 69, gpa: 0.0, letter: 'F' },
    ]
  },

  aiim: {
    name: 'Adventist International Institute of Manila',
    scale: '0-100',
    conversions: [
      { min: 93, max: 100, gpa: 4.0, letter: 'A' },
      { min: 90, max: 92, gpa: 3.7, letter: 'A-' },
      { min: 87, max: 89, gpa: 3.3, letter: 'B+' },
      { min: 83, max: 86, gpa: 3.0, letter: 'B' },
      { min: 80, max: 82, gpa: 2.7, letter: 'B-' },
      { min: 77, max: 79, gpa: 2.3, letter: 'C+' },
      { min: 73, max: 76, gpa: 2.0, letter: 'C' },
      { min: 70, max: 72, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 69, gpa: 0.0, letter: 'F' },
    ]
  },

  arellano: {
    name: 'Arellano University',
    scale: '0-100',
    conversions: [
      { min: 99, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 96, max: 98, gpa: 4.0, letter: 'A' },
      { min: 93, max: 95, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 92, gpa: 3.3, letter: 'B+' },
      { min: 87, max: 89, gpa: 3.0, letter: 'B' },
      { min: 84, max: 86, gpa: 2.7, letter: 'B-' },
      { min: 81, max: 83, gpa: 2.3, letter: 'C+' },
      { min: 78, max: 80, gpa: 2.0, letter: 'C' },
      { min: 75, max: 77, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  act: {
    name: 'Asian College of Technology',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.3, letter: 'A-' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 4.0, max: 4.0, gpa: 1.0, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  aim: {
    name: 'Asian Institute of Management',
    scale: '0-100',
    conversions: [
      { min: 96, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 94, max: 95, gpa: 4.0, letter: 'A' },
      { min: 92, max: 93, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 91, gpa: 3.3, letter: 'B+' },
      { min: 88, max: 89, gpa: 3.0, letter: 'B' },
      { min: 86, max: 87, gpa: 2.7, letter: 'B-' },
      { min: 84, max: 85, gpa: 2.3, letter: 'C+' },
      { min: 82, max: 83, gpa: 2.0, letter: 'C' },
      { min: 80, max: 81, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 79, gpa: 0.0, letter: 'F' },
    ]
  },

  addu: {
    name: 'Ateneo de Davao University',
    scale: '0-100',
    conversions: [
      { min: 92, max: 100, gpa: 4.0, letter: 'A' },
      { min: 88, max: 91, gpa: 3.5, letter: 'AB' },
      { min: 84, max: 87, gpa: 3.0, letter: 'B' },
      { min: 80, max: 83, gpa: 2.5, letter: 'BC' },
      { min: 76, max: 79, gpa: 2.0, letter: 'C' },
      { min: 72, max: 75, gpa: 1.5, letter: 'D' },
      { min: 0, max: 71, gpa: 0.0, letter: 'F' },
    ]
  },

  amu: {
    name: 'Ateneo de Manila University',
    scale: '0-100',
    conversions: [
      { min: 92, max: 100, gpa: 4.0, letter: 'A' },
      { min: 87, max: 91, gpa: 3.5, letter: 'AB' },
      { min: 83, max: 86, gpa: 3.0, letter: 'B' },
      { min: 79, max: 82, gpa: 2.5, letter: 'BC' },
      { min: 75, max: 78, gpa: 2.0, letter: 'C' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  anu: {
    name: 'Ateneo de Naga University',
    scale: '0-100',
    conversions: [
      { min: 98, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 95, max: 97, gpa: 4.0, letter: 'A' },
      { min: 92, max: 94, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 91, gpa: 3.3, letter: 'B+' },
      { min: 87, max: 89, gpa: 3.0, letter: 'B' },
      { min: 85, max: 86, gpa: 2.7, letter: 'B-' },
      { min: 0, max: 84, gpa: 0.0, letter: 'F' },
    ]
  },

  brokenshire: {
    name: 'Brokenshire College',
    scale: '0-100',
    conversions: [
      { min: 96, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 91, max: 95, gpa: 4.0, letter: 'A' },
      { min: 86, max: 90, gpa: 3.5, letter: 'AB' },
      { min: 80, max: 85, gpa: 3.0, letter: 'B' },
      { min: 76, max: 79, gpa: 2.5, letter: 'BC' },
      { min: 0, max: 75, gpa: 0.0, letter: 'F' },
    ]
  },

  cspc: {
    name: 'Camarines Sur Polytechnic College',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.3, letter: 'A-' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 2.9, gpa: 2.7, letter: 'B-' },
      { min: 3.0, max: 3.9, gpa: 2.0, letter: 'C' },
      { min: 4.0, max: 4.9, gpa: 1.0, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  cghc: {
    name: 'Chinese General Hospital College of Nursing',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.49, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.74, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.24, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.49, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.74, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.99, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.99, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  csl: {
    name: 'Colegio de San Lorenzo',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 94, max: 96, gpa: 4.0, letter: 'A' },
      { min: 91, max: 93, gpa: 3.7, letter: 'A-' },
      { min: 88, max: 90, gpa: 3.3, letter: 'B+' },
      { min: 85, max: 87, gpa: 3.0, letter: 'B' },
      { min: 82, max: 84, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 81, gpa: 2.3, letter: 'C+' },
      { min: 77, max: 79, gpa: 2.0, letter: 'C' },
      { min: 75, max: 76, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  // BATCH 1 CONTINUED - DE LA SALLE & MORE
  dlsu: {
    name: 'De La Salle University',
    scale: '0-4.0',
    conversions: [
      { min: 4.0, max: 4.0, gpa: 4.0, letter: 'A+' },
      { min: 3.5, max: 3.99, gpa: 4.0, letter: 'A' },
      { min: 3.0, max: 3.49, gpa: 3.5, letter: 'A-' },
      { min: 2.5, max: 2.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.49, gpa: 2.5, letter: 'B-' },
      { min: 1.5, max: 1.99, gpa: 2.0, letter: 'C' },
      { min: 1.0, max: 1.49, gpa: 1.5, letter: 'C-' },
      { min: 0.0, max: 0.99, gpa: 0.0, letter: 'F' },
    ]
  },

  delmark: {
    name: 'Delmark Global Academy',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.25, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.75, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.25, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.5, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  dwu: {
    name: 'Divine Word University of Tacloban',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 3.7, letter: 'A-' },
      { min: 1.6, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  dhvsu: {
    name: 'Don Honorio Ventura State University',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.7, letter: 'A-' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 3.1, max: 4.0, gpa: 1.7, letter: 'D' },
      { min: 4.1, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  eac: {
    name: 'Emilio Aguinaldo College',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.25, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.7, letter: 'B+' },
      { min: 1.75, max: 1.75, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.0, gpa: 2.7, letter: 'C+' },
      { min: 2.25, max: 2.25, gpa: 2.3, letter: 'C' },
      { min: 2.5, max: 2.5, gpa: 1.7, letter: 'C' },
      { min: 2.75, max: 2.75, gpa: 1.3, letter: 'D' },
      { min: 3.0, max: 3.0, gpa: 0.7, letter: 'D-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  // BATCH 2 - FAR EASTERN
  feu: {
    name: 'Far Eastern University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 93, max: 96, gpa: 3.7, letter: 'A-' },
      { min: 89, max: 92, gpa: 3.3, letter: 'B+' },
      { min: 85, max: 88, gpa: 3.0, letter: 'B' },
      { min: 82, max: 84, gpa: 2.7, letter: 'B-' },
      { min: 78, max: 81, gpa: 2.3, letter: 'C+' },
      { min: 74, max: 77, gpa: 2.0, letter: 'C' },
      { min: 71, max: 73, gpa: 1.7, letter: 'C-' },
      { min: 60, max: 70, gpa: 1.0, letter: 'D+' },
      { min: 0, max: 59, gpa: 0.0, letter: 'F' },
    ]
  },

  feu_1970s: {
    name: 'Far Eastern University (1970s)',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.25, gpa: 3.7, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.75, gpa: 3.0, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.25, gpa: 2.7, letter: 'B' },
      { min: 2.5, max: 2.5, gpa: 2.3, letter: 'C' },
      { min: 2.75, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  // BATCH 3 - KING'S TO MIRIAM
  kcp: {
    name: "King's College of the Philippines",
    scale: '0-100',
    conversions: [
      { min: 96, max: 100, gpa: 4.0, letter: 'A' },
      { min: 93, max: 95.99, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 92.99, gpa: 3.3, letter: 'B+' },
      { min: 87, max: 89.99, gpa: 3.0, letter: 'B' },
      { min: 84, max: 86.99, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 83.99, gpa: 2.3, letter: 'C+' },
      { min: 78, max: 79.99, gpa: 2.0, letter: 'C' },
      { min: 76, max: 77.99, gpa: 1.7, letter: 'C-' },
      { min: 75, max: 75.99, gpa: 1.3, letter: 'C-' },
      { min: 0, max: 74.99, gpa: 0.0, letter: 'F' },
    ]
  },

  lnu: {
    name: 'Lyceum Northwestern University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 94, max: 96.99, gpa: 3.7, letter: 'A-' },
      { min: 91, max: 93.99, gpa: 3.3, letter: 'B+' },
      { min: 88, max: 90.99, gpa: 3.0, letter: 'B' },
      { min: 85, max: 87.99, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 84.99, gpa: 2.3, letter: 'C+' },
      { min: 75, max: 79.99, gpa: 2.0, letter: 'C' },
      { min: 70, max: 74.99, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 69.99, gpa: 0.0, letter: 'F' },
    ]
  },

  mapua: {
    name: 'Mapua University',
    scale: '0-100',
    conversions: [
      { min: 98, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 96, max: 97, gpa: 4.0, letter: 'A' },
      { min: 93, max: 95, gpa: 3.7, letter: 'A-' },
      { min: 89, max: 92, gpa: 3.3, letter: 'B+' },
      { min: 86, max: 88, gpa: 3.0, letter: 'B' },
      { min: 83, max: 85, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 82, gpa: 2.3, letter: 'C+' },
      { min: 77, max: 79, gpa: 2.0, letter: 'C' },
      { min: 75, max: 76, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  mmsu: {
    name: 'Mariano Marcos State University',
    scale: '1.0-4.0',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A' },
      { min: 1.1, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.0, gpa: 2.7, letter: 'B-' },
      { min: 2.1, max: 2.25, gpa: 2.3, letter: 'C+' },
      { min: 2.5, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'C-' },
      { min: 4.0, max: 4.0, gpa: 0.0, letter: 'F' },
    ]
  },

  medina: {
    name: 'Medina College',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B-' },
      { min: 2.0, max: 2.24, gpa: 2.7, letter: 'C' },
      { min: 2.25, max: 2.49, gpa: 2.3, letter: 'C-' },
      { min: 2.5, max: 3.99, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  miriam: {
    name: 'Miriam College',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 4.5, max: 5.0, gpa: 4.0, letter: 'A' },
      { min: 3.5, max: 4.0, gpa: 3.0, letter: 'B' },
      { min: 2.5, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 1.5, max: 2.0, gpa: 1.7, letter: 'C-' },
      { min: 1.0, max: 1.0, gpa: 0.0, letter: 'D' },
      { min: 0.0, max: 0.99, gpa: 0.0, letter: 'F' },
    ]
  },

  // BATCH 4 - POLYTECHNIC TO ST. SCHOLASTICA
  plvu: {
    name: 'Pamantasan ng Lungsod ng Valenzuela University',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.24, gpa: 2.7, letter: 'B-' },
      { min: 2.25, max: 2.49, gpa: 2.3, letter: 'C+' },
      { min: 2.5, max: 2.74, gpa: 2.0, letter: 'C' },
      { min: 2.75, max: 2.99, gpa: 1.7, letter: 'C-' },
      { min: 3.0, max: 4.99, gpa: 1.0, letter: 'D+' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  pnu: {
    name: 'Philippine Normal University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 94, max: 96.99, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 93.99, gpa: 3.3, letter: 'B+' },
      { min: 87, max: 89.99, gpa: 3.0, letter: 'B' },
      { min: 81, max: 86.99, gpa: 2.3, letter: 'B-' },
      { min: 75, max: 80.99, gpa: 2.0, letter: 'C+' },
      { min: 0, max: 74.99, gpa: 0.0, letter: 'C' },
    ]
  },

  pwu: {
    name: "Philippine Women's University",
    scale: '0-100',
    conversions: [
      { min: 100, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 98, max: 99, gpa: 4.0, letter: 'A' },
      { min: 96, max: 97, gpa: 3.7, letter: 'A-' },
      { min: 93, max: 95, gpa: 3.3, letter: 'B+' },
      { min: 88, max: 92, gpa: 3.0, letter: 'B' },
      { min: 85, max: 87, gpa: 2.7, letter: 'B-' },
      { min: 83, max: 84, gpa: 2.3, letter: 'C+' },
      { min: 80, max: 82, gpa: 2.0, letter: 'C' },
      { min: 75, max: 79, gpa: 1.7, letter: 'C-' },
      { min: 74, max: 100, gpa: 0.0, letter: 'F' },
    ]
  },

  pcc: {
    name: 'Pines City Colleges',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.49, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.74, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.24, gpa: 3.0, letter: 'B' },
      { min: 2.5, max: 2.74, gpa: 2.3, letter: 'B-' },
      { min: 3.0, max: 3.99, gpa: 1.7, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  pup: {
    name: 'Polytechnic University of the Philippines',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.24, gpa: 2.7, letter: 'B-' },
      { min: 2.25, max: 2.49, gpa: 2.3, letter: 'C+' },
      { min: 2.5, max: 2.74, gpa: 2.0, letter: 'C' },
      { min: 2.75, max: 2.99, gpa: 1.7, letter: 'C-' },
      { min: 3.0, max: 4.99, gpa: 1.0, letter: 'D+' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  qcpu: {
    name: 'Quezon City Polytechnic University',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.24, gpa: 2.7, letter: 'B-' },
      { min: 2.25, max: 2.49, gpa: 2.3, letter: 'C+' },
      { min: 2.5, max: 2.74, gpa: 2.0, letter: 'C' },
      { min: 2.75, max: 2.99, gpa: 1.7, letter: 'C-' },
      { min: 3.0, max: 4.99, gpa: 1.0, letter: 'D+' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  slu: {
    name: 'Saint Louis University',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A' },
      { min: 1.25, max: 1.49, gpa: 3.7, letter: 'A-' },
      { min: 1.5, max: 1.74, gpa: 3.3, letter: 'B+' },
      { min: 1.75, max: 1.99, gpa: 3.0, letter: 'B' },
      { min: 2.0, max: 2.24, gpa: 2.7, letter: 'B-' },
      { min: 2.25, max: 2.49, gpa: 2.3, letter: 'C+' },
      { min: 2.5, max: 2.74, gpa: 2.0, letter: 'C' },
      { min: 2.75, max: 2.99, gpa: 1.7, letter: 'C-' },
      { min: 3.0, max: 3.99, gpa: 1.0, letter: 'D' },
      { min: 4.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  spua: {
    name: 'Saint Paul University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 95, max: 96, gpa: 3.7, letter: 'A-' },
      { min: 93, max: 94, gpa: 3.3, letter: 'B+' },
      { min: 90, max: 92, gpa: 3.0, letter: 'B' },
      { min: 88, max: 89, gpa: 2.7, letter: 'B-' },
      { min: 85, max: 87, gpa: 2.3, letter: 'C+' },
      { min: 83, max: 84, gpa: 2.0, letter: 'C' },
      { min: 80, max: 82, gpa: 1.7, letter: 'C-' },
      { min: 78, max: 79, gpa: 1.3, letter: 'D+' },
      { min: 75, max: 77, gpa: 1.0, letter: 'D' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  sjdl: {
    name: 'San Juan de Letran College',
    scale: '0-100',
    conversions: [
      { min: 96, max: 100, gpa: 4.0, letter: 'A' },
      { min: 90, max: 95, gpa: 3.7, letter: 'A-' },
      { min: 87, max: 89, gpa: 3.3, letter: 'B+' },
      { min: 85, max: 86, gpa: 3.0, letter: 'B' },
      { min: 83, max: 84, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 82, gpa: 2.3, letter: 'C+' },
      { min: 78, max: 79, gpa: 2.0, letter: 'C' },
      { min: 75, max: 77, gpa: 1.7, letter: 'C-' },
      { min: 60, max: 74, gpa: 1.0, letter: 'D' },
      { min: 0, max: 59, gpa: 0.0, letter: 'F' },
    ]
  },

  su: {
    name: 'Silliman University',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 93, max: 96.99, gpa: 3.7, letter: 'AB' },
      { min: 89, max: 92.99, gpa: 3.3, letter: 'B' },
      { min: 81, max: 88.99, gpa: 3.0, letter: 'BC' },
      { min: 77, max: 80.99, gpa: 2.3, letter: 'C' },
      { min: 73, max: 76.99, gpa: 2.0, letter: 'CD' },
      { min: 0, max: 72.99, gpa: 0.0, letter: 'F' },
    ]
  },

  swu: {
    name: 'Southwestern University',
    scale: '1.0-3.0',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.39, gpa: 4.0, letter: 'A' },
      { min: 1.4, max: 1.69, gpa: 3.7, letter: 'A-' },
      { min: 1.7, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.29, gpa: 3.0, letter: 'B' },
      { min: 2.3, max: 2.59, gpa: 2.7, letter: 'B-' },
      { min: 2.6, max: 2.89, gpa: 2.3, letter: 'C+' },
      { min: 2.9, max: 3.0, gpa: 2.0, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  stpaul: {
    name: 'St. Paul College of Manila',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 95, max: 96, gpa: 3.7, letter: 'A-' },
      { min: 93, max: 94, gpa: 3.3, letter: 'B+' },
      { min: 91, max: 92, gpa: 3.0, letter: 'B' },
      { min: 88, max: 90, gpa: 2.7, letter: 'B-' },
      { min: 85, max: 87, gpa: 2.3, letter: 'C+' },
      { min: 82, max: 84, gpa: 2.0, letter: 'C' },
      { min: 79, max: 81, gpa: 1.7, letter: 'C-' },
      { min: 76, max: 78, gpa: 1.3, letter: 'D+' },
      { min: 75, max: 75.99, gpa: 1.0, letter: 'D' },
      { min: 0, max: 74.99, gpa: 0.0, letter: 'F' },
    ]
  },

  ssc: {
    name: "St. Scholastica's College",
    scale: '0-100',
    conversions: [
      { min: 95, max: 100, gpa: 4.0, letter: 'A' },
      { min: 90, max: 94, gpa: 3.7, letter: 'A-' },
      { min: 85, max: 89, gpa: 3.3, letter: 'B+' },
      { min: 80, max: 84, gpa: 3.0, letter: 'B' },
      { min: 75, max: 79, gpa: 2.7, letter: 'B-' },
      { min: 70, max: 74, gpa: 2.3, letter: 'C+' },
      { min: 65, max: 69, gpa: 2.0, letter: 'C' },
      { min: 60, max: 64, gpa: 1.7, letter: 'C-' },
      { min: 55, max: 59, gpa: 1.3, letter: 'D+' },
      { min: 50, max: 54, gpa: 1.0, letter: 'D' },
      { min: 0, max: 49, gpa: 0.0, letter: 'F' },
    ]
  },

  // BATCH 5 - UNCIANO TO XAVIER
  unci: {
    name: 'Unciano Colleges Inc.',
    scale: '0-100',
    conversions: [
      { min: 99, max: 100, gpa: 4.0, letter: 'A+' },
      { min: 96, max: 98, gpa: 4.0, letter: 'A' },
      { min: 93, max: 95, gpa: 3.7, letter: 'A-' },
      { min: 90, max: 92, gpa: 3.3, letter: 'B+' },
      { min: 87, max: 89, gpa: 3.0, letter: 'B' },
      { min: 84, max: 86, gpa: 2.7, letter: 'B-' },
      { min: 82, max: 83, gpa: 2.3, letter: 'C+' },
      { min: 79, max: 81, gpa: 2.0, letter: 'C' },
      { min: 75, max: 78, gpa: 1.7, letter: 'C-' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  uc: {
    name: 'University of Cebu',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.09, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.5, letter: 'AB' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 2.9, gpa: 2.3, letter: 'BC' },
      { min: 3.0, max: 3.99, gpa: 2.0, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  umak: {
    name: 'University of Makati',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.3, letter: 'B+' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 4.0, max: 4.0, gpa: 1.7, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  unp: {
    name: 'University of Northern Philippines',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.49, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.74, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 3.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  upc: {
    name: 'University of Pangasinan',
    scale: '0-100',
    conversions: [
      { min: 97, max: 100, gpa: 4.0, letter: 'A' },
      { min: 94, max: 96, gpa: 3.7, letter: 'A-' },
      { min: 91, max: 93, gpa: 3.3, letter: 'B+' },
      { min: 88, max: 90, gpa: 3.0, letter: 'B' },
      { min: 85, max: 87, gpa: 2.7, letter: 'B-' },
      { min: 80, max: 84, gpa: 2.3, letter: 'C+' },
      { min: 75, max: 79, gpa: 2.0, letter: 'C' },
      { min: 0, max: 74, gpa: 0.0, letter: 'F' },
    ]
  },

  uphsd: {
    name: 'University of Perpetual Help System DALTA',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.25, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.75, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.25, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.5, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  usc: {
    name: 'University of San Carlos',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 3.3, letter: 'B+' },
      { min: 1.6, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  usjr: {
    name: 'University of San Jose - Recoletos',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.3, letter: 'B+' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 2.9, gpa: 2.7, letter: 'B-' },
      { min: 3.0, max: 3.0, gpa: 2.3, letter: 'C' },
      { min: 3.1, max: 4.0, gpa: 1.7, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  ust: {
    name: 'University of Santo Tomas',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.25, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.75, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.25, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.5, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  usm: {
    name: 'University of Southern Mindanao',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.49, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.74, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.24, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.49, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.74, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.99, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.99, gpa: 1.7, letter: 'C-' },
      { min: 4.0, max: 4.99, gpa: 1.0, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  uc2: {
    name: 'University of the Cordilleras',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.24, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.49, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.74, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.99, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.24, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.49, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.74, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.99, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.99, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  ue: {
    name: 'University of the East',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.0, gpa: 4.0, letter: 'A+' },
      { min: 1.25, max: 1.25, gpa: 4.0, letter: 'A' },
      { min: 1.5, max: 1.5, gpa: 3.7, letter: 'A-' },
      { min: 1.75, max: 1.75, gpa: 3.3, letter: 'B+' },
      { min: 2.0, max: 2.0, gpa: 3.0, letter: 'B' },
      { min: 2.25, max: 2.25, gpa: 2.7, letter: 'B-' },
      { min: 2.5, max: 2.5, gpa: 2.3, letter: 'C+' },
      { min: 2.75, max: 2.75, gpa: 2.0, letter: 'C' },
      { min: 3.0, max: 3.0, gpa: 1.7, letter: 'C-' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  uplb: {
    name: 'University of the Philippines Los Banos',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.49, gpa: 4.0, letter: 'A+' },
      { min: 1.5, max: 1.99, gpa: 4.0, letter: 'A' },
      { min: 2.0, max: 2.49, gpa: 3.3, letter: 'B' },
      { min: 2.5, max: 2.99, gpa: 3.0, letter: 'BC' },
      { min: 3.0, max: 3.99, gpa: 2.3, letter: 'C' },
      { min: 4.0, max: 4.99, gpa: 1.7, letter: 'D' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  uv: {
    name: 'University of the Visayas',
    scale: '1.0-5.0 Inverse',
    conversions: [
      { min: 1.0, max: 1.09, gpa: 4.0, letter: 'A+' },
      { min: 1.1, max: 1.5, gpa: 4.0, letter: 'A' },
      { min: 1.6, max: 2.0, gpa: 3.3, letter: 'AB' },
      { min: 2.1, max: 2.5, gpa: 3.0, letter: 'B' },
      { min: 2.6, max: 2.9, gpa: 2.7, letter: 'BC' },
      { min: 3.0, max: 3.99, gpa: 2.0, letter: 'C' },
      { min: 5.0, max: 5.0, gpa: 0.0, letter: 'F' },
    ]
  },

  xu: {
    name: 'Xavier University',
    scale: '0-100',
    conversions: [
      { min: 92, max: 100, gpa: 4.0, letter: 'A' },
      { min: 84, max: 91.99, gpa: 3.0, letter: 'B' },
      { min: 76, max: 83.99, gpa: 2.0, letter: 'C' },
      { min: 68, max: 75.99, gpa: 1.0, letter: 'D' },
      { min: 50, max: 67.99, gpa: 0.0, letter: 'F' },
      { min: 0, max: 49.99, gpa: 0.0, letter: 'F' },
    ]
  },

  xu_2012: {
    name: 'Xavier University (2012-2013)',
    scale: '0-100',
    conversions: [
      { min: 92, max: 100, gpa: 4.0, letter: 'A' },
      { min: 84, max: 91.99, gpa: 3.0, letter: 'A-' },
      { min: 76, max: 83.99, gpa: 2.0, letter: 'B' },
      { min: 68, max: 75.99, gpa: 1.0, letter: 'B-' },
      { min: 60, max: 67.99, gpa: 0.5, letter: 'C' },
      { min: 50, max: 59.99, gpa: 0.0, letter: 'D' },
      { min: 0, max: 49.99, gpa: 0.0, letter: 'F' },
    ]
  },
};

// Function to get conversion for a school and grade
export const getGPAConversion = (schoolId, grade, gradeScale) => {
  const school = SCHOOL_CONVERSIONS[schoolId];
  if (!school || !school.conversions) {
    return null;
  }

  // Handle numeric grades
  const numGrade = parseFloat(grade);
  if (isNaN(numGrade)) return null;

  // Find the range that matches this grade
  for (const range of school.conversions) {
    if (numGrade >= range.min && numGrade <= range.max) {
      return {
        gpa: range.gpa,
        letter: range.letter,
        range: `${range.min}-${range.max}`,
        schoolName: school.name,
      };
    }
  }

  return null;
};

export default SCHOOL_CONVERSIONS;
