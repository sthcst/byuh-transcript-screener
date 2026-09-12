# n8n Workflow Setup Guide - BYUH High School/College Transcript Screener

## Overview

This guide creates an n8n workflow that:
- ✅ Accepts PDF uploads from the app
- ✅ Detects if PDF is digital or camera photo
- ✅ Extracts text from digital PDFs
- ✅ Uses Ollama AI for camera photo processing
- ✅ Returns extracted grades to the app
- ✅ Runs 100% locally, never uploads to cloud

---

## Prerequisites

1. **n8n installed** locally on school's machine
2. **Ollama installed** with Llama 2 model ready
3. **Node.js** (comes with n8n)

---

## Installation Steps

### Step 1: Start n8n

```bash
n8n start
```

This starts n8n on `http://localhost:5678`

Open in browser: http://localhost:5678

---

### Step 2: Create New Workflow

1. Click **"+ Create New Workflow"**
2. Name it: **"Transcript PDF Processing"**
3. Save

---

### Step 3: Add Webhook Trigger

**Purpose:** Accept PDF uploads from the app

1. Click **"+ Add Node"**
2. Search for **"Webhook"**
3. Select **"Webhook Trigger"**
4. Configure:
   - **Method:** POST
   - **Path:** `/transcript-process`
   - **Authentication:** None (local only)
   - **Save**

---

### Step 4: Add PDF Detection Node

**Purpose:** Determine if PDF is digital or camera photo

1. Click **"+ Add Node"** after Webhook
2. Search for **"Code"**
3. Select **"Execute Code"** (JavaScript)
4. Name it: **"Detect PDF Type"**
5. Add this code:

```javascript
// Get the PDF data from webhook
const pdfData = $input.first().json.pdf; // base64 encoded

// For now, we'll check file size as simple heuristic
// Digital PDFs with text layers are usually > 500KB when binary
// Camera photos are usually < 300KB

// In production, use pdf.js to check text layer
const pdfBuffer = Buffer.from(pdfData, 'base64');
const fileSize = pdfBuffer.length;

const isDigital = fileSize > 500000; // 500KB threshold

return {
  json: {
    pdfData: pdfData,
    pdfSize: fileSize,
    pdfType: isDigital ? 'digital' : 'camera',
    isDigital: isDigital
  }
};
```

6. Click **"Save"**

---

### Step 5: Add PDF Text Extraction Node (Digital)

**Purpose:** Extract text from digital PDFs

1. Click **"+ Add Node"** after "Detect PDF Type"
2. Search for **"PDF"**
3. Select **"PDF Extraction"** (if available) OR use **"HTTP Request"**
4. Name it: **"Extract from Digital PDF"**

**If using HTTP Request:**
- **Method:** POST
- **URL:** `http://localhost:3000/api/extract-pdf`
- **Send Body:** JSON
- **Body:**
```json
{
  "pdf": "{{ $node[\"Detect PDF Type\"].json.pdfData }}",
  "type": "digital"
}
```

5. Click **"Save"**

---

### Step 6: Add Ollama AI Processing Node (Camera)

**Purpose:** Use Ollama to extract grades from camera photos

1. Click **"+ Add Node"** after "Detect PDF Type"
2. Search for **"HTTP Request"**
3. Select **"HTTP Request"**
4. Name it: **"Process with Ollama"**
5. Configure:
   - **Method:** POST
   - **URL:** `http://localhost:11434/api/generate`
   - **Send Body:** JSON
   - **Body:**
```json
{
  "model": "llama2",
  "prompt": "Extract all grades and numbers from this transcript image text:\n{{ $node[\"Detect PDF Type\"].json.pdfData }}\n\nReturn ONLY: grade1, grade2, grade3... as comma-separated numbers.",
  "stream": false
}
```

6. Click **"Save"**

---

### Step 7: Add Conditional Branch

**Purpose:** Route based on PDF type (digital vs camera)

1. Click **"+ Add Node"** after "Detect PDF Type"
2. Search for **"If"**
3. Select **"IF Node"**
4. Configure:
   - **Condition:** `pdfType` equals `"digital"`
   - **True path:** Extract from Digital PDF
   - **False path:** Process with Ollama

5. Click **"Save"**

---

### Step 8: Add Response Node

**Purpose:** Return results to the app

1. Click **"+ Add Node"** (at the end of both branches)
2. Search for **"Respond"**
3. Select **"Respond to Webhook"**
4. Configure:
   - **Status Code:** 200
   - **Response Body:**
```json
{
  "success": true,
  "pdfType": "{{ $node[\"Detect PDF Type\"].json.pdfType }}",
  "extractedText": "{{ $node[\"Extract from Digital PDF\"].json.text || $node[\"Process with Ollama\"].json.response }}",
  "grades": "{{ $node[\"Extract Grades\"].json.grades }}"
}
```

5. Click **"Save"**

---

### Step 9: Add Extract Grades Node

**Purpose:** Parse the extracted text and pull out grade numbers

1. Click **"+ Add Node"**
2. Search for **"Code"**
3. Select **"Execute Code"**
4. Name it: **"Extract Grades"**
5. Add this code:

```javascript
const text = $input.first().json.extractedText || '';

// Extract all numbers that look like grades (0-100 or 1-5)
const gradePattern = /\b([0-9]{1,3}(?:\.[0-9]{1,2})?|[1-5](?:\.[0-9]{1,2})?)\b/g;
const matches = text.match(gradePattern) || [];

// Filter valid grades
const grades = matches
  .map(g => parseFloat(g))
  .filter(g => (g >= 0 && g <= 100) || (g >= 1 && g <= 5))
  .filter((g, i, arr) => arr.indexOf(g) === i); // Remove duplicates

return {
  json: {
    grades: grades,
    gradeCount: grades.length,
    extractedText: text
  }
};
```

6. Click **"Save"**

---

### Step 10: Deploy Workflow

1. Click **"Save"** (top right)
2. Click **"Activate"** (toggle to ON)
3. Copy the webhook URL: `http://localhost:5678/webhook/transcript-process`

---

## Testing the Workflow

### Test with cURL:

```bash
curl -X POST http://localhost:5678/webhook/transcript-process \
  -H "Content-Type: application/json" \
  -d '{"pdf": "JVBERi0xLjQK..."}'  # base64 PDF data
```

---

## Workflow Summary

```
Webhook (POST) 
    ↓
Detect PDF Type (Check file size)
    ↓
    ├─ Digital → Extract PDF Text → Extract Grades → Response
    └─ Camera → Ollama AI → Extract Grades → Response
```

---

## Important Notes

⚠️ **This is a simplified workflow.** For production:
- Use proper PDF.js for text layer detection
- Add error handling for Ollama timeouts
- Add logging for debugging
- Add rate limiting
- Add input validation

✅ **This workflow is 100% offline** - nothing leaves the school's machine!

---

## Next Steps

1. Set up this workflow in n8n
2. Update the app to call the webhook URL
3. Test end-to-end with a real PDF
4. Adjust grades extraction logic based on test results

---

**Questions?** Check n8n docs at: https://docs.n8n.io/
