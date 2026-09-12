/**
 * N8N INTEGRATION MODULE
 * Handles communication between app and n8n workflow
 * All PDF processing happens via n8n (locally, no cloud)
 */

const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_URL || 'http://localhost:5678/webhook/transcript-process';

/**
 * Check if n8n is running and accessible
 */
export const checkN8nStatus = async () => {
  try {
    const response = await fetch(`${N8N_WEBHOOK_URL.replace('/webhook/transcript-process', '')}/api/v1/workflows`);
    return response.ok;
  } catch (error) {
    console.log('n8n not accessible:', error);
    return false;
  }
};

/**
 * Process PDF via n8n workflow
 * @param {ArrayBuffer} pdfBuffer - The PDF file as ArrayBuffer
 * @param {File} file - The File object for metadata
 * @returns {Promise<Object>} Result with pdfType, extractedText, grades
 */
export const processPDFWithN8n = async (pdfBuffer, file) => {
  try {
    // Check if n8n is available
    const isN8nAvailable = await checkN8nStatus();
    if (!isN8nAvailable) {
      return {
        success: false,
        error: 'n8n service not running. Please start n8n and try again.',
        stage: 'n8n_check',
      };
    }

    // Convert PDF to base64
    const pdfBase64 = btoa(
      new Uint8Array(pdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log(`Processing PDF: ${file.name} (${file.size} bytes)`);

    // Send to n8n workflow
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdf: pdfBase64,
        fileName: file.name,
        fileSize: file.size,
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Unknown error processing PDF',
        stage: 'processing',
      };
    }

    // Parse results
    return {
      success: true,
      pdfType: result.pdfType, // 'digital' or 'camera'
      extractedText: result.extractedText,
      grades: result.grades || [],
      gradeCount: (result.grades || []).length,
    };
  } catch (error) {
    console.error('Error processing PDF with n8n:', error);
    return {
      success: false,
      error: error.message,
      stage: 'network',
    };
  }
};

/**
 * Detect if PDF is digital or camera photo
 * (Called by n8n workflow, but can be used for UI feedback)
 */
export const detectPDFType = async (pdfBuffer) => {
  try {
    // Simple heuristic: file size
    // Digital PDFs with text layers are usually larger when compressed
    // This is handled by n8n, but we can use for quick feedback

    const fileSize = pdfBuffer.byteLength;
    const isLikelyDigital = fileSize > 500000; // 500KB threshold

    return {
      isDigital: isLikelyDigital,
      fileSize: fileSize,
      estimatedType: isLikelyDigital ? 'digital' : 'camera',
    };
  } catch (error) {
    console.error('Error detecting PDF type:', error);
    return null;
  }
};

/**
 * Extract grades from text
 * (Helper for parsing extracted text from n8n)
 */
export const extractGradesFromText = (text) => {
  if (!text) return [];

  const grades = [];

  // Match various patterns
  const patterns = [
    /\b([6-9]\d|100)(?:\s|,|$|\n)/g,  // 60-100
    /\b([1-5]\.\d{1,2})\b/g,          // 1.00-5.99
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const grade = parseFloat(match[1]);
      if (grade > 0 && grade <= 100) {
        if (!grades.includes(grade)) {
          grades.push(grade);
        }
      }
    }
  });

  return [...new Set(grades)].sort((a, b) => b - a).slice(0, 15);
};

/**
 * Health check - verify n8n and Ollama are ready
 */
export const performHealthCheck = async () => {
  const checks = {
    n8n: false,
    ollama: false,
    timestamp: new Date().toISOString(),
  };

  // Check n8n
  try {
    const n8nResponse = await fetch(`${N8N_WEBHOOK_URL.replace('/webhook/transcript-process', '')}/api/v1/workflows`);
    checks.n8n = n8nResponse.ok;
  } catch (e) {
    checks.n8n = false;
  }

  // Check Ollama (via n8n, since it's local)
  try {
    const ollamaCheck = await fetch('http://localhost:11434/api/tags');
    checks.ollama = ollamaCheck.ok;
  } catch (e) {
    checks.ollama = false;
  }

  checks.allHealthy = checks.n8n && checks.ollama;

  return checks;
};

export default {
  checkN8nStatus,
  processPDFWithN8n,
  detectPDFType,
  extractGradesFromText,
  performHealthCheck,
};
