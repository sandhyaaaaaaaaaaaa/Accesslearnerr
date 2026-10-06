import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});
const upload = multer({ storage });

const users = [];
const documents = [];

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'Email already registered.' });
  }
  const newUser = { id: uuidv4(), name, email, role, password };
  users.push(newUser);
  return res.status(201).json({ id: newUser.id, name, email, role });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  const user = users.find((u) => u.email === email && u.password === password && u.role === role);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.post('/api/documents/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const document = {
    id: uuidv4(),
    title: req.body.title || req.file.originalname,
    source: req.body.source || `Uploaded: ${req.file.originalname}`,
    originalText: '',
    status: 'processing',
    filename: req.file.filename,
    uploadedAt: new Date().toISOString(),
  };
  documents.push(document);
  return res.status(201).json(document);
});

app.get('/api/documents/:id', (req, res) => {
  const document = documents.find((doc) => doc.id === req.params.id);
  if (!document) {
    return res.status(404).json({ message: 'Document not found.' });
  }
  return res.json(document);
});

app.get('/api/documents', (req, res) => {
  const role = req.query.role;
  if (role === 'teacher') {
    return res.json({ documents, stats: { total: documents.length } });
  }
  return res.json(documents.filter((doc) => doc.status === 'ready' || doc.status === 'processing'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
