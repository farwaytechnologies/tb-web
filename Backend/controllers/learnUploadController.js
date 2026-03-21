const mammoth = require('mammoth');
const Learn = require('../models/LearnModel');

// ─── Helper: parse .docx buffer into Learn schema ───────────────────────────
async function parseDocx(buffer) {
  const { value: html } = await mammoth.convertToHtml({ buffer });

  // Split on <h1> or <h2> tags — each heading becomes a module
  const moduleBlocks = html.split(/<h[12][^>]*>/i).filter(Boolean);

  const modules = moduleBlocks.map((block) => {
    // Extract heading text (up to closing tag)
    const titleMatch = block.match(/^([^<]+)<\/h[12]>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Module';

    // Strip all HTML tags for plain content
    const rest = block.replace(/^[^<]*<\/h[12]>/i, '');
    const content = rest.replace(/<[^>]+>/g, '').trim();

    // Extract code blocks from <pre> or <code> tags
    const codeMatch = rest.match(/<(?:pre|code)[^>]*>([\s\S]*?)<\/(?:pre|code)>/i);
    const codeExample = codeMatch
      ? codeMatch[1].replace(/<[^>]+>/g, '').trim()
      : '';

    return { title, description: '', content, codeExample, image: '' };
  }).filter(m => m.title && m.title !== 'Untitled Module');

  return modules;
}

// ─── Helper: parse .json file ────────────────────────────────────────────────
function parseJson(buffer) {
  const data = JSON.parse(buffer.toString('utf-8'));
  // Accept either a single object or an array
  return Array.isArray(data) ? data : [data];
}

// ─── POST /api/learn/upload ──────────────────────────────────────────────────
exports.uploadCourse = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const { originalname, buffer, mimetype } = req.file;
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
      // For .docx, language name comes from form field or filename
      const language = req.body.language || originalname.replace(/\.docx$/i, '').trim();
      const modules = await parseDocx(buffer);

      if (modules.length === 0) {
        return res.status(400).json({ message: 'Could not extract any modules from the document. Make sure headings (H1/H2) are used for module titles.' });
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
