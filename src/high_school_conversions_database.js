/**
 * BYUH HIGH SCHOOL GRADE CONVERSION DATABASE
 * Philippine Secondary School Grade Scales
 * Used for Grade 11 & 12 Transcript Evaluation
 */

export const HIGH_SCHOOL_SCALES = [
  {
    id: 'most-common-secondary',
    name: 'Most Common Secondary',
    type: '0-100',
    description: 'Standard 0-100 percentage scale',
    isDefault: true,
  },
  {
    id: 'science-high-school',
    name: 'Secondary (Philippine Science High School)',
    type: 'dual',
    description: '1.0-5.0 and 0-100 percentage scale',
  },
  {
    id: 'international-baccalaureate',
    name: 'International Baccalaureate',
    type: '1-7',
    description: 'IB Diploma Programme scale',
  },
  {
    id: 'our-lady-fatima',
    name: 'Our Lady of Fatima University',
    type: 'dual',
    description: '1.0-5.0 and 0-100 percentage scale',
  },
  {
    id: 'university-iloilo',
    name: 'University of Iloilo',
    type: 'dual',
    description: '1.0-5.0 and 0-100 percentage scale',
  },
  {
    id: 'university-assumption',
    name: 'University of the Assumption',
    type: 'dual',
    description: '1.0-5.0 and 0-100 percentage scale',
  },
];

// Conversion tables for each scale
const CONVERSIONS = {
  'most-common-secondary': [
    { min: 95, max: 100, gpa: 4.0, letter: 'A', description: 'Excellent' },
    { min: 90, max: 94.99, gpa: 3.7, letter: 'B+', description: 'Very Good' },
    { min: 85, max: 89.99, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 80, max: 84.99, gpa: 3.0, letter: 'C', description: 'Satisfactory' },
    { min: 75, max: 79.99, gpa: 2.7, letter: 'C', description: 'Fairly Satisfactory' },
    { min: 0, max: 74.99, gpa: 0.0, letter: 'F', description: 'Needs Special Help' },
  ],
  'science-high-school': [
    { min: 1.0, max: 1.25, percentage: 97, gpa: 4.0, letter: 'A', description: 'Excellent' },
    { min: 1.25, max: 1.49, percentage: 94, gpa: 3.7, letter: 'A-', description: 'Very good' },
    { min: 1.5, max: 1.74, percentage: 91, gpa: 3.5, letter: 'B+', description: 'Very good' },
    { min: 1.75, max: 1.99, percentage: 88, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 2.0, max: 2.24, percentage: 85, gpa: 3.0, letter: 'B-', description: 'Good' },
    { min: 2.25, max: 2.49, percentage: 82, gpa: 2.7, letter: 'C+', description: 'Satisfactory' },
    { min: 2.5, max: 2.74, percentage: 80, gpa: 2.5, letter: 'C', description: 'Satisfactory' },
    { min: 2.75, max: 2.99, percentage: 78, gpa: 2.3, letter: 'C-', description: 'Unsatisfactory' },
    { min: 3.0, max: 3.99, percentage: 75, gpa: 2.0, letter: 'D+', description: 'Unsatisfactory' },
    { min: 4.0, max: 4.99, percentage: 70, gpa: 1.7, letter: 'D', description: 'Conditional' },
    { min: 5.0, max: 5.0, percentage: 0, gpa: 0.0, letter: 'F', description: 'Fail' },
  ],
  'international-baccalaureate': [
    { min: 6, max: 7, gpa: 4.0, letter: 'A', description: 'Excellent' },
    { min: 5, max: 5.99, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 4, max: 4.99, gpa: 2.7, letter: 'C', description: 'Satisfactory' },
    { min: 3, max: 3.99, gpa: 2.0, letter: 'D', description: 'Pass' },
    { min: 1, max: 2.99, gpa: 0.0, letter: 'F', description: 'Fail' },
  ],
  'our-lady-fatima': [
    { min: 1.0, max: 1.0, percentage: 98, gpa: 4.0, letter: 'A+', description: 'Excellent' },
    { min: 1.25, max: 1.25, percentage: 95, gpa: 4.0, letter: 'A', description: 'Excellent' },
    { min: 1.5, max: 1.5, percentage: 92, gpa: 3.7, letter: 'A-', description: 'Very Good' },
    { min: 1.75, max: 1.75, percentage: 89, gpa: 3.5, letter: 'B+', description: 'Very Good' },
    { min: 2.0, max: 2.0, percentage: 86, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 2.25, max: 2.25, percentage: 83, gpa: 3.0, letter: 'B-', description: 'Good' },
    { min: 2.5, max: 2.5, percentage: 80, gpa: 2.7, letter: 'C+', description: 'Satisfactory' },
    { min: 2.75, max: 2.75, percentage: 76, gpa: 2.5, letter: 'C', description: 'Satisfactory' },
    { min: 3.0, max: 3.0, percentage: 75, gpa: 2.3, letter: 'C-', description: 'Satisfactory' },
    { min: 5.0, max: 5.0, percentage: 0, gpa: 0.0, letter: 'F', description: 'Failure' },
  ],
  'university-iloilo': [
    { min: 1.0, max: 1.0, percentage: 98, gpa: 4.0, letter: 'A+', description: 'Excellent' },
    { min: 1.25, max: 1.25, percentage: 95, gpa: 4.0, letter: 'A', description: 'Excellent' },
    { min: 1.5, max: 1.5, percentage: 92, gpa: 3.7, letter: 'A-', description: 'Very Good' },
    { min: 1.75, max: 1.75, percentage: 89, gpa: 3.5, letter: 'B+', description: 'Very Good' },
    { min: 2.0, max: 2.0, percentage: 86, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 2.25, max: 2.25, percentage: 83, gpa: 3.0, letter: 'B-', description: 'Good' },
    { min: 2.5, max: 2.5, percentage: 80, gpa: 2.7, letter: 'C+', description: 'Satisfactory' },
    { min: 2.75, max: 2.75, percentage: 76, gpa: 2.5, letter: 'C', description: 'Satisfactory' },
    { min: 3.0, max: 3.0, percentage: 75, gpa: 2.3, letter: 'C-', description: 'Satisfactory' },
    { min: 5.0, max: 5.0, percentage: 0, gpa: 0.0, letter: 'F', description: 'Failure' },
  ],
  'university-assumption': [
    { min: 1.0, max: 1.0, percentage: 95, gpa: 4.0, letter: 'A+', description: 'Excellent' },
    { min: 1.3, max: 1.3, percentage: 93, gpa: 4.0, letter: 'A', description: 'Very Superior' },
    { min: 1.5, max: 1.5, percentage: 90, gpa: 3.7, letter: 'A-', description: 'Superior' },
    { min: 1.8, max: 1.8, percentage: 88, gpa: 3.5, letter: 'B+', description: 'Very Good' },
    { min: 2.0, max: 2.0, percentage: 85, gpa: 3.3, letter: 'B', description: 'Good' },
    { min: 2.3, max: 2.3, percentage: 83, gpa: 3.0, letter: 'B-', description: 'Very Satisfactory' },
    { min: 2.5, max: 2.5, percentage: 80, gpa: 2.7, letter: 'C+', description: 'Satisfactory' },
    { min: 2.8, max: 2.8, percentage: 78, gpa: 2.5, letter: 'C', description: 'Fair' },
    { min: 3.0, max: 3.0, percentage: 75, gpa: 2.3, letter: 'C-', description: 'Passed' },
    { min: 5.0, max: 5.0, percentage: 0, gpa: 0.0, letter: 'F', description: 'Failed' },
  ],
};

/**
 * Get GPA conversion for a grade in a specific scale
 * @param {string} scaleId - The scale ID (e.g., 'most-common-secondary')
 * @param {number} grade - The grade value
 * @returns {Object} Conversion object with gpa, letter, description
 */
export const getGradeConversion = (scaleId, grade) => {
  const conversions = CONVERSIONS[scaleId];
  if (!conversions) {
    console.error(`Unknown scale: ${scaleId}`);
    return null;
  }

  const gradeNum = parseFloat(grade);
  if (isNaN(gradeNum)) return null;

  // Find matching conversion
  const conversion = conversions.find(c => gradeNum >= c.min && gradeNum <= c.max);
  return conversion || null;
};

/**
 * Get all high school scales
 */
export const getHighSchoolScales = () => HIGH_SCHOOL_SCALES;

/**
 * Get default high school scale
 */
export const getDefaultHighSchoolScale = () => HIGH_SCHOOL_SCALES.find(s => s.isDefault);

export default {
  HIGH_SCHOOL_SCALES,
  getGradeConversion,
  getHighSchoolScales,
  getDefaultHighSchoolScale,
};
