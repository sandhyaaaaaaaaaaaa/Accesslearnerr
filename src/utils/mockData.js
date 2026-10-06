export const SAMPLE_DOCUMENT = {
  id: 'doc-001',
  title: 'Introduction to Photosynthesis',
  source: 'Biology Textbook — Chapter 4',
  uploadedAt: '2026-07-15T10:30:00Z',
  status: 'ready',
  formats: {
    audio: { status: 'ready', progress: 100 },
    braille: { status: 'ready', progress: 100 },
    simplified: { status: 'ready', progress: 100 },
    translation: { status: 'ready', progress: 100 },
    epub: { status: 'ready', progress: 100 },
    summary: { status: 'ready', progress: 100 },
    flashcards: { status: 'ready', progress: 100 },
    quiz: { status: 'ready', progress: 100 },
  },
  originalText: `Chapter 4: Photosynthesis

Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This fundamental biological process sustains virtually all life on Earth by producing oxygen and organic compounds.

The process occurs primarily in the chloroplasts of plant cells. Chloroplasts contain chlorophyll, a green pigment that absorbs light energy most efficiently in the blue and red wavelengths of the visible spectrum.

The overall equation for photosynthesis can be summarized as:
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

Photosynthesis occurs in two main stages: the light-dependent reactions and the Calvin cycle (light-independent reactions). During the light-dependent reactions, which take place in the thylakoid membranes, light energy is captured and used to split water molecules, releasing oxygen as a byproduct and generating ATP and NADPH.

The Calvin cycle occurs in the stroma of the chloroplast. Using the ATP and NADPH produced in the light reactions, carbon dioxide is fixed into organic molecules through a series of enzyme-catalyzed reactions, ultimately producing glucose.

Factors affecting the rate of photosynthesis include light intensity, carbon dioxide concentration, temperature, and water availability. Understanding these factors is crucial for agriculture, ecology, and addressing climate change.`,
  simplifiedText: {
    grade3: `Plants Make Food from Sunlight

Plants use sunlight to make their own food. This is called photosynthesis.

Green plants have a special green color called chlorophyll. It catches sunlight.

Plants take in air and water. They use sunlight to turn them into sugar. Sugar is food for the plant.

Plants also make oxygen. We breathe oxygen to live. Plants help us breathe!

This happens inside tiny parts of the plant cell called chloroplasts.`,
    grade5: `How Plants Make Food

Photosynthesis is how plants make food using sunlight. Green plants, algae, and some tiny organisms do this.

Plants have a green chemical called chlorophyll inside their cells. Chlorophyll catches light from the sun.

The plant takes in carbon dioxide from the air and water from the soil. Using sunlight energy, it turns these into sugar (glucose). Sugar is the plant's food.

Plants also release oxygen into the air. This oxygen is important for animals and humans to breathe.

Photosynthesis happens in two steps. First, light reactions capture energy. Then, the Calvin cycle uses that energy to build sugar.`,
    grade8: `Photosynthesis: Converting Light to Chemical Energy

Photosynthesis is the process where plants, algae, and certain bacteria convert light energy into stored chemical energy in the form of glucose.

This occurs in chloroplasts, which contain chlorophyll — a pigment that absorbs blue and red light most effectively.

The overall reaction: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

Two stages are involved:
1. Light-dependent reactions (thylakoid membranes) — split water, release O₂, produce ATP and NADPH
2. Calvin cycle (stroma) — uses ATP and NADPH to fix CO₂ into glucose

Key factors: light intensity, CO₂ levels, temperature, and water. These affect agricultural yield and ecosystem health.`,
  },
  translations: {
    hi: `अध्याय 4: प्रकाश संश्लेषण

प्रकाश संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे, शैवाल और कुछ बैक्टीरिया प्रकाश ऊर्जा को ग्लूकोज में संग्रहीत रासायनिक ऊर्जा में परिवर्तित करते हैं।`,
    te: `అధ్యాయం 4: కిరణజన్య సంయోగక్రియ

కిరణజన్య సంయోగక్రియ అనేది పచ్చని మొక్కలు, ఆకురాలు మరియు కొన్ని బ్యాక్టీరియాలు కాంతి శక్తిని గ్లూకోజ్‌లో నిల్వ చేసిన రసాయన శక్తిగా మార్చే ప్రక్రియ.`,
    ta: `அத்தியாயம் 4: ஒளிச்சேர்க்கை

ஒளிச்சேர்க்கை என்பது பச்சைத் தாவரங்கள், பாசிகள் மற்றும் சில பாக்டீரியாக்கள் ஒளி ஆற்றலை குளுக்கோஸில் சேமிக்கப்பட்ட வேதியியல் ஆற்றலாக மாற்றும் செயல்முறையாகும்.`,
    es: `Capítulo 4: Fotosíntesis

La fotosíntesis es el proceso por el cual las plantas verdes, algas y algunas bacterias convierten la energía lumínica en energía química almacenada en glucosa.`,
  },
  flashcards: [
    { front: 'What is photosynthesis?', back: 'The process by which plants convert light energy into chemical energy (glucose).' },
    { front: 'Where does photosynthesis occur?', back: 'In the chloroplasts of plant cells.' },
    { front: 'What pigment captures light?', back: 'Chlorophyll — absorbs blue and red wavelengths.' },
    { front: 'What are the two stages?', back: 'Light-dependent reactions and the Calvin cycle.' },
    { front: 'What gas is released?', back: 'Oxygen (O₂) — released when water is split.' },
  ],
  quiz: [
    {
      question: 'Where does photosynthesis primarily occur in plant cells?',
      options: ['Mitochondria', 'Chloroplasts', 'Nucleus', 'Cell wall'],
      correct: 1,
      explanation: 'Photosynthesis occurs in chloroplasts, which contain chlorophyll.',
    },
    {
      question: 'What gas is released as a byproduct of the light-dependent reactions?',
      options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
      correct: 2,
      explanation: 'Water molecules are split during light reactions, releasing oxygen.',
    },
    {
      question: 'Which pigment absorbs light energy for photosynthesis?',
      options: ['Hemoglobin', 'Melanin', 'Chlorophyll', 'Carotene'],
      correct: 2,
      explanation: 'Chlorophyll is the green pigment that captures light energy.',
    },
  ],
};

export const PIPELINE_STAGES = [
  { id: 'ingestion', label: 'Ingestion', description: 'Accepting and validating your document' },
  { id: 'extraction', label: 'Extraction', description: 'OCR and text extraction with structure preservation' },
  { id: 'enrichment', label: 'Enrichment', description: 'Image descriptions, math-to-speech, structure tagging' },
  { id: 'transformation', label: 'Transformation', description: 'Generating audio, Braille, simplified text, translations' },
  { id: 'personalization', label: 'Personalization', description: 'Adapting formats to your learner profile' },
  { id: 'delivery', label: 'Delivery', description: 'Preparing accessible outputs for viewing' },
];

export const OUTPUT_FORMATS = [
  { id: 'audio', label: 'Audio (TTS)', icon: 'Volume2', description: 'Natural voice with karaoke highlighting' },
  { id: 'braille', label: 'Braille (BRF)', icon: 'CircleDot', description: 'Grade 1/2 Braille Ready Format' },
  { id: 'simplified', label: 'Simplified Text', icon: 'BookOpen', description: 'Grade-level adapted content' },
  { id: 'translation', label: 'Translation', icon: 'Languages', description: 'Multilingual accessible text' },
  { id: 'epub', label: 'EPUB/HTML', icon: 'FileText', description: 'Screen-reader-friendly structured output' },
  { id: 'summary', label: 'Summary', icon: 'List', description: 'AI-generated content summary' },
  { id: 'flashcards', label: 'Flashcards', icon: 'Layers', description: 'Study cards from key concepts' },
  { id: 'quiz', label: 'Quiz', icon: 'HelpCircle', description: 'Comprehension assessment' },
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'fr', label: 'French (Français)' },
  { code: 'de', label: 'German (Deutsch)' },
];

export const READING_LEVELS = [
  { id: 'grade3', label: 'Grade 3', description: 'Very simple sentences, basic vocabulary' },
  { id: 'grade5', label: 'Grade 5', description: 'Short sentences, common words' },
  { id: 'grade8', label: 'Grade 8', description: 'Moderate complexity, subject terms kept' },
];

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/tiff': ['.tiff', '.tif'],
};

export const MAX_FILE_SIZE_MB = 50;

export const MOCK_STUDENT_DOCS = [
  { ...SAMPLE_DOCUMENT },
  {
    id: 'doc-002',
    title: 'Newton\'s Laws of Motion',
    source: 'Physics Notes — Week 3',
    uploadedAt: '2026-07-12T14:00:00Z',
    status: 'processing',
    formats: {
      audio: { status: 'processing', progress: 72 },
      braille: { status: 'ready', progress: 100 },
      simplified: { status: 'ready', progress: 100 },
      translation: { status: 'failed', progress: 0 },
      epub: { status: 'processing', progress: 45 },
      summary: { status: 'ready', progress: 100 },
      flashcards: { status: 'pending', progress: 0 },
      quiz: { status: 'pending', progress: 0 },
    },
  },
];

export const MOCK_TEACHER_STATS = {
  totalDocuments: 47,
  studentsActive: 128,
  formatsGenerated: 312,
  avgProcessingTime: '2.4 min',
  recentUploads: [
    { student: 'Priya S.', document: 'Cell Biology Ch.2', status: 'ready', time: '10 min ago' },
    { student: 'Arjun M.', document: 'History Essay Draft', status: 'processing', time: '25 min ago' },
    { student: 'Meera K.', document: 'Math Worksheet Scan', status: 'ready', time: '1 hr ago' },
    { student: 'Rahul D.', document: 'Chemistry Lab Notes', status: 'failed', time: '2 hr ago' },
  ],
};

export const CHATBOT_RESPONSES = [
  {
    keywords: ['photosynthesis', 'plant', 'chlorophyll'],
    response: 'Photosynthesis is how plants make food using sunlight. Chlorophyll in chloroplasts captures light energy, which is used to convert CO₂ and water into glucose and oxygen. Would you like me to explain the two stages in more detail?',
  },
  {
    keywords: ['calvin', 'cycle', 'dark reaction'],
    response: 'The Calvin cycle (light-independent reactions) happens in the stroma of chloroplasts. It uses ATP and NADPH from the light reactions to fix carbon dioxide into glucose through enzyme-catalyzed steps.',
  },
  {
    keywords: ['oxygen', 'byproduct'],
    response: 'Oxygen is released during the light-dependent reactions when water molecules are split (photolysis). This oxygen is essential for most living organisms on Earth!',
  },
];

export const DEFAULT_LEARNER_PROFILE = {
  readingLevel: 'grade5',
  preferredLanguage: 'en',
  needs: ['dyslexia', 'visual_impairment'],
  preferredFormats: ['audio', 'simplified', 'braille'],
  ttsSpeed: 1.0,
  ttsPitch: 1.0,
  highContrast: false,
  fontSize: 'medium',
};
