# BYUH Transcript Screener - Complete Files Guide

## 📋 Project Overview
Production-ready FERPA-compliant transcript screening system for BYUH admissions. Supports both High School (Philippine) and College (Philippine) transcripts with automatic GPA calculation and grade scale conversion.

---

## 🎯 MAIN COMPONENTS

### **Landing Page & Routing**
- **`App.js`** - Main routing component. Routes between landing, high-school, and college views
- **`LandingPage.jsx`** - Landing page with two cards: "High School Transcripts" and "College Transcripts"
- **`index.js`** - Entry point. Imports pdfSetup.js for PDF.js worker configuration

### **High School Screener (NEW)**
- **`HighSchoolTranscriptScreener.jsx`** - Grade 11 & 12 screener. Supports 6 Philippine HS grade scales
- **`high_school_conversions_database.js`** - Database of 6 Philippine HS grade conversion scales

### **College Screener**
- **`TranscriptScreener_Beautiful.jsx`** - Main college screener component. 60+ Philippine college grade conversions
- **`school_conversions_database.js`** - Database of 60+ college grade conversion scales

### **PDF Processing**
- **`pdfSetup.js`** (NEW - YOU ADDED) - PDF.js worker configuration for digital PDF processing
- **`index.css`** - Global styles (updated by you)

---

## 🔧 INTEGRATION MODULES

### **n8n Integration (Future)**
- **`n8n_integration.js`** - API module for calling local n8n at http://localhost:5678
- **`N8N_WORKFLOW_SETUP.md`** - Step-by-step workflow creation guide (PDF → Extract/OCR → Respond)

### **Ollama Integration (Current OCR)**
- **`ollama_integration.js`** - Ollama vision API for camera photos
- Uses Llama 2 locally at http://localhost:11434

---

## 🖥️ ELECTRON BUILD FILES

### **Main Process**
- **`public/main.js`** - Electron main process. Opens window, handles IPC
- **`public/preload.js`** - Context isolation preload script for secure window creation

### **Build Configuration**
- **`package.json`** - Build config for electron-builder (Windows x64 portable .exe)

---

## 📚 DOCUMENTATION

- **`INSTALLATION_GUIDE.md`** - Full school IT setup guide
- **`N8N_WORKFLOW_SETUP.md`** - n8n workflow creation steps
- **`COMPLETE_FILES_GUIDE.md`** - This file

---

## ✅ FOLDER STRUCTURE

```
src/
├── App.js                              (Main routing)
├── LandingPage.jsx                     (Landing page with 2 cards)
├── HighSchoolTranscriptScreener.jsx    (HS screener - NEW)
├── TranscriptScreener_Beautiful.jsx    (College screener)
├── high_school_conversions_database.js (HS grade scales)
├── school_conversions_database.js      (College grade scales)
├── pdfSetup.js                         (PDF.js worker - YOU ADDED)
├── index.js                            (Entry point - UPDATED)
├── index.css                           (Global styles - UPDATED)
├── n8n_integration.js                  (n8n API module)
├── ollama_integration.js               (Ollama OCR)
└── ...

public/
├── main.js                             (Electron main)
├── preload.js                          (Electron preload)
├── ollama_service.js                   (Ollama service manager)
└── index.html
```

---

## 🚀 HOW IT WORKS

### **User Flow:**
1. App launches → **LandingPage** (App.js routes to landing)
2. User clicks "High School Transcripts" → **HighSchoolTranscriptScreener**
3. Upload PDF or manually enter grades → Grades are extracted/converted
4. GPA calculated using **high_school_conversions_database.js**
5. Results displayed, copy to clipboard, save locally

**Same flow for College → TranscriptScreener_Beautiful**

---

## 📦 BUILD COMMAND

```bash
npm run build-win64
```

**Output:**
- `/dist/BYUH Transcript Screener_1.0.0_portable.exe` (~90MB)

---

## 🔐 FERPA Compliance

✅ All PDFs stay on school's computer (no cloud upload)  
✅ No student PII stored  
✅ Grades extracted locally (Ollama or n8n)  
✅ Cost: $0/month (all open-source)

---

## 📝 YOUR EDITS (Session 3)

You added/modified:
- ✅ **`pdfSetup.js`** - PDF.js worker configuration
- ✅ **`index.js`** - Updated to import pdfSetup
- ✅ **`index.css`** - Updated global styles

---

## 🎓 Next Steps

1. **Copy these files to your Mac** project folder (`src/` and `public/`)
2. **Run:** `npm run build-win64`
3. **Test on Windows:** Download the .exe and verify both High School and College screeners work
4. **When n8n access code arrives:** Follow `N8N_WORKFLOW_SETUP.md` and integrate

---

## 📞 Questions?

Refer to:
- Workflow questions → `N8N_WORKFLOW_SETUP.md`
- Installation questions → `INSTALLATION_GUIDE.md`
- Code questions → Ask Claude!

---

**Version:** 1.0.0  
**Status:** Production-Ready  
**Last Updated:** September 8, 2026
