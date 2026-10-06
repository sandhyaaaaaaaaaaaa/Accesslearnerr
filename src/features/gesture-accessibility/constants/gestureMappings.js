export const GESTURE_IDS = {
  LEFT_OPEN_PALM: 'left_open_palm',
  INDEX_FINGER_UP: 'index_finger_up',
  TWO_FINGERS_UP: 'two_fingers_up',
  THREE_FINGERS_UP: 'three_fingers_up',
  THUMBS_UP: 'thumbs_up',
  THUMBS_DOWN: 'thumbs_down',
  CLOSED_FIST: 'closed_fist',
  OPEN_PALM_WAVE: 'open_palm_wave',
  VICTORY_SIGN: 'victory_sign',
};

export const GESTURE_DEFINITIONS = [
  {
    id: GESTURE_IDS.LEFT_OPEN_PALM,
    name: 'Left Open Palm',
    description: 'Open left hand with all fingers extended',
    voice: 'Dashboard opened.',
    icon: '🖐️',
    action: { type: 'navigate', payload: '/dashboard' }
  },
  {
    id: GESTURE_IDS.INDEX_FINGER_UP,
    name: 'Index Finger Up',
    description: 'Raise only your index finger',
    voice: 'Opening Doubts.',
    icon: '☝️',
    action: { type: 'navigate', payload: '/doubts' }
  },
  {
    id: GESTURE_IDS.TWO_FINGERS_UP,
    name: 'Two Fingers Up',
    description: 'Raise index and middle fingers together',
    voice: 'Quiz opened.',
    icon: '✌️',
    action: { type: 'navigate', payload: '/quiz' }
  },
  {
    id: GESTURE_IDS.THREE_FINGERS_UP,
    name: 'Three Fingers Up',
    description: 'Raise index, middle, and ring fingers',
    voice: 'Flashcards opened.',
    icon: '🤟',
    action: { type: 'navigate', payload: '/flashcards' }
  },
  {
    id: GESTURE_IDS.THUMBS_UP,
    name: 'Thumbs Up',
    description: 'Thumb pointing up, other fingers closed',
    voice: 'Next page.',
    icon: '👍',
    action: { type: 'forward' }
  },
  {
    id: GESTURE_IDS.THUMBS_DOWN,
    name: 'Thumbs Down',
    description: 'Thumb pointing down, other fingers closed',
    voice: 'Previous page.',
    icon: '👎',
    action: { type: 'back' }
  },
  {
    id: GESTURE_IDS.CLOSED_FIST,
    name: 'Closed Fist',
    description: 'Close all fingers into a fist',
    voice: 'Reading paused.',
    icon: '✊',
    action: { type: 'callback', payload: 'pauseReading' }
  },
  {
    id: GESTURE_IDS.OPEN_PALM_WAVE,
    name: 'Open Palm Wave',
    description: 'Open palm and wave side to side',
    voice: 'Returning Home.',
    icon: '👋',
    action: { type: 'navigate', payload: '/' }
  },
  {
    id: GESTURE_IDS.VICTORY_SIGN,
    name: 'Victory Sign',
    description: 'Index and middle fingers spread in a V',
    voice: 'Sign Language Mode activated.',
    icon: '🏆',
    action: { type: 'navigate', payload: '/sign-language' }
  },
];

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

export const MEDIAPIPE_WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';

export const HAND_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export const GESTURE_COOLDOWN_MS = 2500;
export const WAVE_HISTORY_FRAMES = 20;
export const WAVE_MOVEMENT_THRESHOLD = 0.08;
