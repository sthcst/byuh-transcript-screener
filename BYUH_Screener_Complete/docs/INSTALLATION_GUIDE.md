# BYUH Transcript Screener - Complete Installation Guide

## System Requirements

- **OS:** Windows 10/11 (64-bit)
- **RAM:** 16GB minimum (8GB if you only use digital PDFs)
- **Disk Space:** 20GB free
- **Network:** Internet connection for initial setup only
- **Software:** Administrator access

---

## Installation Overview

The app requires THREE components, all free and open-source:

```
1. Node.js (JavaScript runtime)
   ↓
2. n8n (Workflow automation - runs locally)
   ├─ PDF processing
   └─ Ollama integration
   ↓
3. Ollama (Local AI - optional for camera photos)
   └─ Llama 2 model (auto-downloads on first use)
   ↓
4. BYUH Transcript Screener App (Electron app)
```

All components run 100% locally. No data leaves your computer. ✅

---

## Part 1: Install Node.js

**Why:** Required for n8n and the app

1. Go to: https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run installer
4. Accept all defaults
5. Click **Finish**

**Verify Installation:**
```bash
node --version
npm --version
```

You should see version numbers (e.g., `v18.15.0`).

---

## Part 2: Install n8n

**Why:** Manages PDF processing and Ollama AI

1. Open **Command Prompt** or **PowerShell**
2. Run:
```bash
npm install -g n8n
```

This takes 5-10 minutes. Wait for it to finish.

3. **Verify:**
```bash
n8n --version
```

---

## Part 3: Install Ollama (OPTIONAL - for camera photos)

**Why:** Enables AI-powered extraction from camera photos

**If you ONLY process digital PDFs:** Skip this section

1. Go to: https://ollama.ai
2. Click **Download**
3. Download **Windows** version
4. Run installer
5. Accept all defaults
6. Ollama launches automatically

**Verify:**
Open Command Prompt:
```bash
ollama list
```

You should see available models.

**Download Llama 2 Model (First Time Only):**
```bash
ollama pull llama2
```

This downloads ~4GB. Do this once when first set up.

---

## Part 4: Create n8n Workflow

**Why:** This is the "brain" that processes PDFs

### Step 1: Start n8n

Open Command Prompt:
```bash
n8n start
```

You'll see:
```
n8n ready on http://localhost:5678
```

Open your browser: http://localhost:5678

### Step 2: Import Workflow

⚠️ **FOR NOW:** We'll provide a pre-built workflow file (coming soon)

For now, follow the manual setup in: `N8N_WORKFLOW_SETUP.md`

### Step 3: Activate Workflow

Once created:
- Click **Save**
- Click **Activate** (toggle ON)
- Copy the webhook URL shown

You'll use this URL in the app setup.

---

## Part 5: Install BYUH Transcript Screener App

1. Download: `BYUH Transcript Screener_1.0.0_portable.exe` (~90MB)
2. Save to Desktop or Program Files
3. Double-click to run

**First Launch:**
- App auto-detects n8n
- Should show: "✅ n8n connected"
- If error: Make sure n8n is running (Step 4)

---

## Startup Procedure

**Every morning when staff starts work:**

### Terminal 1: Start n8n
```bash
n8n start
```

Wait for:
```
n8n ready on http://localhost:5678
```

### Terminal 2 (Optional): Start Ollama
```bash
ollama serve
```

Wait for:
```
Listening on 127.0.0.1:11434
```

### Then: Launch Transcript Screener App
- Double-click the .exe file
- Wait for app to load (~5 seconds)
- Ready to process transcripts!

---

## Configuration

### Environment Variables (Optional)

If n8n is on a different URL, create `.env` file in app directory:

```
REACT_APP_N8N_URL=http://localhost:5678/webhook/transcript-process
```

### Default Settings

- **PDF Upload:** Any size (processed locally)
- **High School Scales:** 6 Philippine scales
- **College Scales:** 60+ Philippine colleges
- **AI Processing:** Uses Ollama (local machine)
- **Data Storage:** Saved entries on local disk

---

## Troubleshooting

### "n8n not accessible"
- Make sure `n8n start` is running in a terminal
- Check: http://localhost:5678 in browser
- If blocked: Check Windows Firewall

### "Cannot connect to Ollama"
- Make sure `ollama serve` is running
- Check: http://localhost:11434/api/tags in browser
- If needed: Run `ollama pull llama2` again

### "PDF processing slow"
- First time: Ollama is warming up (normal, takes 20-30 sec)
- Subsequent: Should be 5-10 seconds
- If still slow: Check system RAM usage

### "App crashes on startup"
- Make sure n8n is already running
- Check Windows Event Viewer for errors
- Try restarting the computer

### "n8n workflow not working"
- Check workflow is **Activated** (toggle ON)
- Test webhook URL manually with cURL (see N8N_WORKFLOW_SETUP.md)
- Check n8n logs for errors

---

## Performance Notes

| Scenario | Time | Requirements |
|----------|------|--------------|
| Digital PDF (text layer) | 2-5 sec | None |
| Camera Photo (first run) | 20-30 sec | Ollama running |
| Camera Photo (subsequent) | 5-10 sec | Ollama running |
| Bulk entry (10 transcripts) | 30-60 sec | Depends on PDF type |

---

## Security & Privacy

✅ **All PDFs stay on school's computer**
✅ **No cloud uploads**
✅ **No external API calls** (except PDF.js library - cached locally)
✅ **FERPA compliant**
✅ **Data stored locally** on school's machine
✅ **Completely offline after setup**

---

## Uninstall / Cleanup

To remove everything:

1. **Delete app:** Remove .exe file and folder
2. **Uninstall n8n:**
   ```bash
   npm uninstall -g n8n
   ```
3. **Uninstall Ollama:** Windows Settings → Apps → Uninstall
4. **Delete data:** Remove `.byuh-` folders in `C:\Users\[username]\AppData\Local\`

---

## Support & Questions

**For issues:**
1. Check troubleshooting section above
2. Review N8N_WORKFLOW_SETUP.md for workflow details
3. Check n8n logs: http://localhost:5678 → Executions tab

**For feature requests:**
- Contact development team with workflow ID and error details

---

## Next Steps After Installation

1. ✅ Install all 3 components (Node.js, n8n, Ollama)
2. ✅ Create n8n workflow (or import provided workflow)
3. ✅ Launch app and verify "n8n connected" message
4. ✅ Test with a sample high school transcript
5. ✅ Train staff on usage
6. ✅ Start processing real transcripts!

---

**You're ready to go!** 🎓🚀

The entire system runs locally on your school's computer. No subscriptions, no cloud, no fees. Just free, open-source tools working together!
