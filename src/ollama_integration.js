/**
 * OLLAMA OCR MODULE
 * Handles vision-based grade extraction from camera photos
 * Uses Llama 2 vision model running locally via Ollama
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'llama2';

/**
 * Check if Ollama is running locally
 */
export const checkOllamaStatus = async () => {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.log('Ollama not running:', error);
    return false;
  }
};

/**
 * Extract text from PDF image using Ollama
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromImage = async (imageBase64) => {
  try {
    const prompt = `You are a document recognition expert. Please extract ALL text from this transcript/grade sheet image. Focus on:
1. School name
2. Student name (if visible)
3. Subject names
4. All numerical grades and marks
5. Any grade scale information

Return ONLY the extracted text, nothing else. Be thorough and extract every number and text you can see.`;

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        images: [imageBase64],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('Error extracting text with Ollama:', error);
    throw error;
  }
};

/**
 * Extract grades from OCR text
 * @param {string} text - Extracted text from image
 * @returns {number[]} Array of grades found
 */
export const extractGradesFromOCR = (text) => {
  const grades = [];
  
  // Match various grade patterns:
  // 0-100 scale: 75, 85, 92, 100
  // 1.0-5.0 scale: 1.5, 2.0, 3.25, 4.75
  // Letter grades: A, B+, C-, etc.
  
  const patterns = [
    /\b([6-9]\d|100)(?:\s|,|$)/g,        // 60-100
    /\b([1-5]\.\d{1,2})\b/g,            // 1.00-5.99
    /\b([1-5])(?:\s|,|$)/g,             // Single digits 1-5
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const grade = parseFloat(match[1]);
      if (grade > 0 && grade <= 100) {
        // Only keep valid grades
        if (!grades.includes(grade)) {
          grades.push(grade);
        }
      }
    }
  });

  return [...new Set(grades)].sort((a, b) => b - a).slice(0, 15);
};

/**
 * Detect school name from OCR text
 * @param {string} text - Extracted text
 * @param {Array} schools - School database
 * @returns {Object|null} Detected school or null
 */
export const detectSchoolFromOCR = (text, schools) => {
  const textLower = text.toLowerCase();
  
  for (const school of schools) {
    if (textLower.includes(school.name.toLowerCase()) || 
        textLower.includes(school.abbr.toLowerCase())) {
      return school;
    }
  }
  
  return null;
};

/**
 * Process camera photo with Ollama
 * Full pipeline: image → OCR → extract grades/school
 */
export const processCameraPhotoWithOllama = async (imageBase64, schools) => {
  try {
    // Check if Ollama is running
    const isRunning = await checkOllamaStatus();
    if (!isRunning) {
      return {
        success: false,
        error: 'Ollama is not running. Please start Ollama and try again.',
        stage: 'ollama_check',
      };
    }

    // Extract text from image
    console.log('Extracting text from image...');
    const extractedText = await extractTextFromImage(imageBase64);

    if (!extractedText || extractedText.trim().length === 0) {
      return {
        success: false,
        error: 'No text could be extracted from the image. Please check image quality.',
        stage: 'text_extraction',
      };
    }

    // Extract grades
    const grades = extractGradesFromOCR(extractedText);

    // Detect school
    const detectedSchool = detectSchoolFromOCR(extractedText, schools);

    return {
      success: true,
      extractedText,
      grades,
      detectedSchool,
      stage: 'complete',
    };
  } catch (error) {
    console.error('Error processing camera photo:', error);
    return {
      success: false,
      error: error.message,
      stage: 'processing_error',
    };
  }
};

export default {
  checkOllamaStatus,
  extractTextFromImage,
  extractGradesFromOCR,
  detectSchoolFromOCR,
  processCameraPhotoWithOllama,
};
