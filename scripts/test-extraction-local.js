/**
 * Local terminal test for the AI transcript extraction pipeline - lets us
 * iterate on the prompt/model/logic against a real PDF using Ollama running
 * directly on this Mac, without going through a full Windows CI build each
 * time. Once this looks right, the same logic (src/ollama_integration.js)
 * is what the actual Electron app uses.
 *
 * Requires: Ollama running locally with the model pulled, and poppler's
 * `pdftoppm` on PATH (brew install poppler) to rasterize PDF pages to PNG.
 *
 * Usage: node scripts/test-extraction-local.js <path-to-pdf>
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OLLAMA_API_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'qwen2.5vl:7b';

const EXTRACTION_PROMPT = `You are reading a school transcript image. Extract ONLY the subject names and their final numeric grades into strict JSON, with no other text, no markdown code fences, no explanation.

Output exactly this shape:
{"school_name": "<school name or null>", "student_name": "<student name or null>", "subjects": [{"name": "<subject name>", "grade": "<grade as it appears>"}]}

Rules:
- Only include rows that clearly pair a subject name with a grade.
- Do not invent subjects or grades that are not visible in the image.
- Do not include totals, averages, or GPA as a subject.
- Output must be valid JSON and nothing else.`;

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node scripts/test-extraction-local.js <path-to-pdf>');
  process.exit(1);
}

function rasterizePdfToImages(pdfAbsPath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'transcript-test-'));
  const outPrefix = path.join(tmpDir, 'page');
  execFileSync('pdftoppm', ['-png', '-r', '150', pdfAbsPath, outPrefix]);
  const files = fs.readdirSync(tmpDir)
    .filter((f) => f.endsWith('.png'))
    .sort()
    .map((f) => path.join(tmpDir, f));
  return { files, tmpDir };
}

async function checkOllamaStatus() {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags');
    return res.ok;
  } catch {
    return false;
  }
}

async function extractFromImage(imagePath) {
  const imageBase64 = fs.readFileSync(imagePath).toString('base64');
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: EXTRACTION_PROMPT,
      images: [imageBase64],
      stream: false,
      format: 'json',
      options: { num_predict: 2048, num_ctx: 8192 },
    }),
  });
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }
  const data = await response.json();
  try {
    return JSON.parse(data.response);
  } catch (err) {
    console.error('\n--- RAW MODEL OUTPUT (failed to parse as JSON) ---');
    console.error(data.response);
    console.error('--- done_reason:', data.done_reason, '---\n');
    throw err;
  }
}

async function main() {
  const absPath = path.resolve(pdfPath);
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  console.log('Checking Ollama...');
  if (!(await checkOllamaStatus())) {
    console.error('Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }
  console.log('Ollama is up.\n');

  console.log(`Rasterizing ${absPath}...`);
  const { files, tmpDir } = rasterizePdfToImages(absPath);
  console.log(`${files.length} page(s) rendered.\n`);

  try {
    for (let i = 0; i < files.length; i++) {
      const start = Date.now();
      console.log(`--- Page ${i + 1} of ${files.length} ---`);
      console.log('Sending to model, this can take a few minutes on CPU...');
      const result = await extractFromImage(files[i]);
      const seconds = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`Done in ${seconds}s.`);
      console.log('School:', result.school_name);
      console.log('Student:', result.student_name);
      console.log('Subjects:');
      for (const s of result.subjects || []) {
        console.log(`  ${s.name}: ${s.grade}`);
      }
      console.log('');
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
