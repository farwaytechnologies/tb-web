const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage
} = require('../controllers/learnController');
const { uploadCourse } = require('../controllers/learnUploadController');

// Multer — memory storage, accept .json and .docx only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/json',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(file.mimetype) || ext === 'json' || ext === 'docx') {
      cb(null, true);
    } else {
      cb(new Error('Only .json and .docx files are allowed.'));
    }
  },
});

// Upload route (before /:id to avoid conflict)
router.post('/upload', upload.single('file'), uploadCourse);

// Standard CRUD
router.post('/', createLanguage);
router.get('/', getAllLanguages);
router.get('/:id', getLanguageById);
router.put('/:id', updateLanguage);
router.delete('/:id', deleteLanguage);

module.exports = router;
