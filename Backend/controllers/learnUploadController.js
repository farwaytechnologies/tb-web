const mammoth = require('mammoth');
const Learn = require('../models/LearnModel');

// ─── Helper: parse .docx buffer into Learn schema ───────────────────────────
async function parseDocx(buffer) {
  // Strip embedded images to avoid base64 bloat / MongoDB 16MB limit
  const { value: html } = await mammoth.convertToHtml(
    { buffer },
    {
      convertImage: mammoth.images.imgElement(() => ({ src: '' })),
    }
  );

  // ── Strategy 1: doc uses Heading styles (H1/H2/H3) ──────────────────────
  if (/<h[123][^>]*>/i.test(html)) {
    const parts = html.split(/(?=<h[123][^>]*>)/i).filter(Boolean);
    const modules = parts.map((block) => {
      const titleMatch = block.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/i);
      if (!titleMatch) return null;
      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      if (!title) return null;

      const rest = block.replace(/<h[123][^>]*>[\s\S]*?<\/h[123]>/i, '');
      const codeMatches = [...rest.matchAll(/<(?:pre|code)[^>]*>([\s\S]*?)<\/(?:pre|code)>/gi)];
      const codeExample = codeMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).join('\n\n');
      const content = rest
        .replace(/<(?:pre|code)[^>]*>[\s\S]*?<\/(?:pre|code)>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      return { title, description: '', content, codeExample, image: '' };
    }).filter(Boolean);

    if (modules.length > 0) return modules;
  }

  // ── Strategy 2: plain-text style doc (your actual format) ───────────────
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  // Title patterns:
  // "1. What is C#?" / "2. What is .NET?"  — numbered sections
  // "Lesson 1.1: ..."                       — lesson prefix
  // "Key Characteristics:" / "Components of .NET:" — short label ending with colon
  // Bold-only short lines (mammoth wraps bold in <strong> inside <p>)
  const boldParagraphs = [...html.matchAll(/<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<\/p>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim());

  const isSectionTitle = (line) => {
    if (!line || line.length > 160) return false;
    if (/^\d+\.\s+\S/.test(line)) return true;                        // "1. Something"
    if (/^Lesson\s+[\d.]+[:–\-]/i.test(line)) return true;           // "Lesson 1.1:"
    if (/^(Chapter|Module|Section|Part|Unit)\s+[\d]/i.test(line)) return true;
    if (boldParagraphs.includes(line)) return true;                   // entire paragraph is bold
    return false;
  };

  // Code label: a standalone line that is just a language name
  const isCodeLabel = (line) =>
    /^(C#|Java|Python|JavaScript|JS|TS|TypeScript|SQL|HTML|CSS|Bash|Shell|Output|Result)$/i.test(line.trim());

  // Image reference: "//filename.jpg" or "//filename.png"
  const isImageRef = (line) => /^\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(line.trim());

  const modules = [];
  let current = null;
  let inCodeBlock = false;
  let codeLines = [];

  const flushCode = () => {
    if (current && codeLines.length > 0) {
      current.codeExample += (current.codeExample ? '\n\n' : '') + codeLines.join('\n');
      codeLines = [];
    }
    inCodeBlock = false;
  };

  const saveCurrent = () => {
    if (current) {
      flushCode();
      modules.push(current);
    }
  };

  for (const line of paragraphs) {
    // Skip image references (embedded image placeholders)
    if (isImageRef(line)) continue;

    // Code label — next lines are code until next title or blank
    if (isCodeLabel(line)) {
      flushCode();
      inCodeBlock = true;
      codeLines = [];
      continue;
    }

    // Section title — start a new module
    if (isSectionTitle(line)) {
      saveCurrent();
      current = { title: line, description: '', content: '', codeExample: '', image: '' };
      inCodeBlock = false;
      codeLines = [];
      continue;
    }

    // No module started yet — create an intro bucket
    if (!current) {
      current = { title: 'Introduction', description: '', content: '', codeExample: '', image: '' };
    }

    if (inCodeBlock) {
      codeLines.push(line);
    } else {
      current.content += (current.content ? '\n' : '') + line;
    }
  }

  saveCurrent();

  return modules.filter(m => m.title && (m.content || m.codeExample));
}

// ─── Helper: parse .json file ────────────────────────────────────────────────
function parseJson(buffer) {
  const data = JSON.parse(buffer.toString('utf-8'));
  return Array.isArray(data) ? data : [data];
}

// ─── POST /api/learn/upload ──────────────────────────────────────────────────
exports.uploadCourse = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const { originalname, buffer } = req.file;
    const ext = originalname.split('.').pop().toLowerCase();

    let created = [];

    if (ext === 'json') {
      const entries = parseJson(buffer);

      for (const entry of entries) {
        if (!entry.language) {
          return res.status(400).json({ message: 'Each entry must have a "language" field.' });
        }
        const doc = new Learn({
          language: entry.language,
          shortDescription: entry.shortDescription || '',
          image: entry.image || '',
          modules: (entry.modules || []).map(m => ({
            title: m.title || '',
            description: m.description || '',
            content: m.content || '',
            codeExample: m.codeExample || '',
            image: m.image || '',
          })),
        });
        await doc.save();
        created.push(doc);
      }

    } else if (ext === 'docx') {
      const language = req.body.language || originalname.replace(/\.docx$/i, '').trim();
      const modules = await parseDocx(buffer);

      if (modules.length === 0) {
        return res.status(400).json({
          message: 'Could not extract any modules. Make sure your doc uses Heading 1, Heading 2, or Heading 3 styles for module titles (not just bold text).'
        });
      }

      const doc = new Learn({
        language,
        shortDescription: req.body.shortDescription || '',
        image: req.body.image || '',
        modules,
      });
      await doc.save();
      created.push(doc);

    } else {
      return res.status(400).json({ message: 'Unsupported file type. Upload a .json or .docx file.' });
    }

    res.status(201).json({ message: `${created.length} course(s) imported successfully.`, data: created });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: err.message || 'Upload failed.' });
  }
};
