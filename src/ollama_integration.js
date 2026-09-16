/**
 * OLLAMA VISION MODULE
 * Extracts subjects and grades directly from a transcript image (a rendered
 * PDF page or a camera photo) using a local vision-language model via Ollama.
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5vl:7b';

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

const EXTRACTION_PROMPT = `You are reading a school transcript image. Extract ONLY the subject names and their final numeric grades into strict JSON, with no other text, no markdown code fences, no explanation.

Output exactly this shape:
{"school_name": "<school name or null>", "student_name": "<student name or null>", "subjects": [{"name": "<subject name>", "grade": "<grade as it appears>"}]}

Rules:
- Only include rows that clearly pair a subject name with a grade.
- Do not invent subjects or grades that are not visible in the image.
- Do not include totals, averages, or GPA as a subject.
- Output must be valid JSON and nothing else.`;

/**
 * Extract structured subject/grade data from a transcript image.
 * @param {string} imageBase64 - Base64 encoded image (no data: prefix)
 */
export const extractTranscriptData = async (imageBase64) => {
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: EXTRACTION_PROMPT,
      images: [imageBase64],
      stream: false,
      format: 'json',
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.response);
  return {
    school_name: parsed.school_name ?? null,
    student_name: parsed.student_name ?? null,
    subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
  };
};

/**
 * Match an extracted school name against the known school database.
 */
export const matchSchool = (schoolName, schools) => {
  if (!schoolName) return null;
  const nameLower = schoolName.toLowerCase();
  return (
    schools.find(
      (school) => nameLower.includes(school.name.toLowerCase()) || nameLower.includes(school.abbr.toLowerCase())
    ) || null
  );
};

/**
 * Process a transcript image (a rendered PDF page or a camera photo).
 * Full pipeline: image -> structured subjects/grades -> school match.
 */
export const processTranscriptImageWithOllama = async (imageBase64, schools) => {
  try {
    const isRunning = await checkOllamaStatus();
    if (!isRunning) {
      return {
        success: false,
        error: 'Ollama is not running. Please start Ollama and try again.',
        stage: 'ollama_check',
      };
    }

    const result = await extractTranscriptData(imageBase64);

    if (result.subjects.length === 0) {
      return {
        success: false,
        error: 'No subjects/grades could be read from this page.',
        stage: 'extraction',
      };
    }

    const detectedSchool = matchSchool(result.school_name, schools);

    return {
      success: true,
      subjects: result.subjects,
      studentName: result.student_name,
      detectedSchool,
      stage: 'complete',
    };
  } catch (error) {
    console.error('Error processing transcript image:', error);
    return {
      success: false,
      error: error.message,
      stage: 'processing_error',
    };
  }
};

export default {
  checkOllamaStatus,
  extractTranscriptData,
  matchSchool,
  processTranscriptImageWithOllama,
};
