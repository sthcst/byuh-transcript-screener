# BYUH Transcript Screener - Windows Build Instructions

## Overview
This guide will walk you through building the BYUH Transcript Screener into a Windows 64-bit executable (.exe file).

---

## Prerequisites

You need to have installed on your Mac/Windows:
- **Node.js 16+** → Download from https://nodejs.org/
- **Git** (optional, but recommended) → https://git-scm.com/

---

## Step 1: Setup Your Project Folder

```bash
# Create a new folder for the project
mkdir byuh-transcript-screener
cd byuh-transcript-screener

# Initialize React app (if not already created)
npx create-react-app .
```

---

## Step 2: Copy Files

Copy these files into your project folder:

**Root folder (`/`):**
- `main.js` → Copy to `/public/main.js`
- `preload.js` → Copy to `/public/preload.js`
- `package.json` → Replace existing file

**React Component:**
- `TranscriptScreener_Beautiful.jsx` → Copy to `/src/TranscriptScreener_Beautiful.jsx`

**Update `/src/index.js`:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import TranscriptScreener from './TranscriptScreener_Beautiful';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TranscriptScreener />
  </React.StrictMode>
);
```

---

## Step 3: Install Dependencies

```bash
npm install

# Install Electron build tools
npm install --save-dev electron electron-builder electron-is-dev concurrently wait-on
```

---

## Step 4: Build the Windows .exe

```bash
# Build for Windows 64-bit (portable + installer)
npm run build-win64
```

This will create:
- **BYUH_Transcript_Screener_1.0.0_portable.exe** (standalone, no install needed)
- **BYUH_Transcript_Screener_Setup_1.0.0.exe** (installer)

Both files are in the `/dist` folder.

---

## Step 5: Test the App

Double-click the `.exe` file to run it!

---

## What You Get

✅ **Standalone executable** - Works on any Windows 64-bit computer  
✅ **No installation required** (portable version) - Run from anywhere  
✅ **Installer option** - Professional installation package  
✅ **Completely offline** - Data never leaves the computer  
✅ **All 60+ schools** - With correct GPA conversion formulas  
✅ **PDF upload** - Digital PDF detection + auto-extraction  
✅ **Export to Excel** - Download results as CSV for SharePoint  

---

## Distribution

Share the `.exe` file with BYUH admissions staff via:
- Email
- USB drive
- File sharing (Google Drive, OneDrive, etc.)
- Network share

---

## Troubleshooting

**"npm: command not found"**
→ Install Node.js from https://nodejs.org/

**"electron-builder not found"**
→ Run: `npm install --save-dev electron-builder`

**Build takes forever**
→ Normal! First build can take 5-10 minutes. Subsequent builds are faster.

**App won't open**
→ Check Windows antivirus (may flag unsigned app). Add exception if needed.

---

## Next Steps

Once the .exe is built:

1. **Test on school computer** - Make sure it works
2. **Distribute to admissions staff** - Email or USB
3. **Gather feedback** - See what improvements they want
4. **Plan Phase 2** - Maybe add Ollama AI for PDF extraction if staff needs it

---

## Support

If you hit issues during the build:
1. Check that all files are in the right folders
2. Make sure you have Node.js 16+
3. Try: `npm install` again
4. Check the build errors for clues

Good luck! 🚀
