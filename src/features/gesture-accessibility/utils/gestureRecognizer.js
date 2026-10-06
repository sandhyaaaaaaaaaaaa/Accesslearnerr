import { GESTURE_IDS, WAVE_HISTORY_FRAMES, WAVE_MOVEMENT_THRESHOLD } from '../constants/gestureMappings';

const FINGER = {
  thumb: { tip: 4, ip: 3, mcp: 2 },
  index: { tip: 8, pip: 6, mcp: 5 },
  middle: { tip: 12, pip: 10, mcp: 9 },
  ring: { tip: 16, pip: 14, mcp: 13 },
  pinky: { tip: 20, pip: 18, mcp: 17 },
};

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isFingerExtended(landmarks, finger, threshold = 0.02) {
  const { tip, pip } = finger;
  return landmarks[tip].y < landmarks[pip].y - threshold;
}

function isThumbExtended(landmarks, handedness, threshold = 0.02) {
  const isLeft = handedness === 'Left';
  if (isLeft) {
    return landmarks[4].x > landmarks[3].x + threshold;
  }
  return landmarks[4].x < landmarks[3].x - threshold;
}

function isThumbUp(landmarks, handedness) {
  const othersClosed =
    !isFingerExtended(landmarks, FINGER.index, 0.01) &&
    !isFingerExtended(landmarks, FINGER.middle, 0.01) &&
    !isFingerExtended(landmarks, FINGER.ring, 0.01) &&
    !isFingerExtended(landmarks, FINGER.pinky, 0.01);
  const thumbAbove = landmarks[4].y < landmarks[2].y - 0.03;
  return othersClosed && thumbAbove && isThumbExtended(landmarks, handedness, 0.01);
}

function isThumbDown(landmarks, handedness) {
  const othersClosed =
    !isFingerExtended(landmarks, FINGER.index, 0.01) &&
    !isFingerExtended(landmarks, FINGER.middle, 0.01) &&
    !isFingerExtended(landmarks, FINGER.ring, 0.01) &&
    !isFingerExtended(landmarks, FINGER.pinky, 0.01);
  const thumbBelow = landmarks[4].y > landmarks[2].y + 0.03;
  return othersClosed && thumbBelow;
}

function isClosedFist(landmarks, handedness) {
  const noneExtended =
    !isFingerExtended(landmarks, FINGER.index, 0.015) &&
    !isFingerExtended(landmarks, FINGER.middle, 0.015) &&
    !isFingerExtended(landmarks, FINGER.ring, 0.015) &&
    !isFingerExtended(landmarks, FINGER.pinky, 0.015);
  const thumbClosed = !isThumbExtended(landmarks, handedness, 0.015);
  return noneExtended && thumbClosed;
}

function isOpenPalm(landmarks, handedness) {
  return (
    isFingerExtended(landmarks, FINGER.index) &&
    isFingerExtended(landmarks, FINGER.middle) &&
    isFingerExtended(landmarks, FINGER.ring) &&
    isFingerExtended(landmarks, FINGER.pinky) &&
    isThumbExtended(landmarks, handedness, 0.01)
  );
}

function countExtendedFingers(landmarks, handedness) {
  let count = 0;
  if (isFingerExtended(landmarks, FINGER.index)) count++;
  if (isFingerExtended(landmarks, FINGER.middle)) count++;
  if (isFingerExtended(landmarks, FINGER.ring)) count++;
  if (isFingerExtended(landmarks, FINGER.pinky)) count++;
  return count;
}

function isVictorySign(landmarks) {
  const indexUp = isFingerExtended(landmarks, FINGER.index);
  const middleUp = isFingerExtended(landmarks, FINGER.middle);
  const ringDown = !isFingerExtended(landmarks, FINGER.ring, 0.01);
  const pinkyDown = !isFingerExtended(landmarks, FINGER.pinky, 0.01);
  const spread = Math.abs(landmarks[8].x - landmarks[12].x);
  return indexUp && middleUp && ringDown && pinkyDown && spread > 0.06;
}

function isTwoFingersUp(landmarks) {
  const indexUp = isFingerExtended(landmarks, FINGER.index);
  const middleUp = isFingerExtended(landmarks, FINGER.middle);
  const ringDown = !isFingerExtended(landmarks, FINGER.ring, 0.01);
  const pinkyDown = !isFingerExtended(landmarks, FINGER.pinky, 0.01);
  const spread = Math.abs(landmarks[8].x - landmarks[12].x);
  return indexUp && middleUp && ringDown && pinkyDown && spread <= 0.06;
}

function isThreeFingersUp(landmarks) {
  return (
    isFingerExtended(landmarks, FINGER.index) &&
    isFingerExtended(landmarks, FINGER.middle) &&
    isFingerExtended(landmarks, FINGER.ring) &&
    !isFingerExtended(landmarks, FINGER.pinky, 0.01)
  );
}

function isIndexFingerUp(landmarks) {
  return (
    isFingerExtended(landmarks, FINGER.index) &&
    !isFingerExtended(landmarks, FINGER.middle, 0.01) &&
    !isFingerExtended(landmarks, FINGER.ring, 0.01) &&
    !isFingerExtended(landmarks, FINGER.pinky, 0.01)
  );
}

function detectWave(wristHistory) {
  if (wristHistory.length < WAVE_HISTORY_FRAMES) return false;
  const xs = wristHistory.map((p) => p.x);
  const range = Math.max(...xs) - Math.min(...xs);
  let directionChanges = 0;
  for (let i = 2; i < xs.length; i++) {
    const prev = xs[i - 1] - xs[i - 2];
    const curr = xs[i] - xs[i - 1];
    if (prev * curr < 0) directionChanges++;
  }
  return range >= WAVE_MOVEMENT_THRESHOLD && directionChanges >= 2;
}

function computeConfidence(scores) {
  const max = Math.max(...scores.map((s) => s.score));
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  if (total === 0) return 0;
  return Math.round((max / total) * 100);
}

export function recognizeGesture(landmarks, handednessLabel, wristHistory = []) {
  if (!landmarks || landmarks.length < 21) {
    return { gestureId: null, gestureName: 'No hand detected', confidence: 0 };
  }

  const handedness = handednessLabel || 'Right';
  const candidates = [];

  if (handedness === 'Left' && isOpenPalm(landmarks, handedness)) {
    candidates.push({ id: GESTURE_IDS.LEFT_OPEN_PALM, score: 0.95 });
  }

  if (isIndexFingerUp(landmarks)) {
    candidates.push({ id: GESTURE_IDS.INDEX_FINGER_UP, score: 0.9 });
  }

  if (isVictorySign(landmarks)) {
    candidates.push({ id: GESTURE_IDS.VICTORY_SIGN, score: 0.92 });
  } else if (isTwoFingersUp(landmarks)) {
    candidates.push({ id: GESTURE_IDS.TWO_FINGERS_UP, score: 0.88 });
  }

  if (isThreeFingersUp(landmarks)) {
    candidates.push({ id: GESTURE_IDS.THREE_FINGERS_UP, score: 0.87 });
  }

  if (isThumbUp(landmarks, handedness)) {
    candidates.push({ id: GESTURE_IDS.THUMBS_UP, score: 0.91 });
  }

  if (isThumbDown(landmarks, handedness)) {
    candidates.push({ id: GESTURE_IDS.THUMBS_DOWN, score: 0.89 });
  }

  if (isClosedFist(landmarks, handedness)) {
    candidates.push({ id: GESTURE_IDS.CLOSED_FIST, score: 0.93 });
  }

  if (isOpenPalm(landmarks, handedness) && detectWave(wristHistory)) {
    candidates.push({ id: GESTURE_IDS.OPEN_PALM_WAVE, score: 0.85 });
  }

  if (candidates.length === 0) {
    const extended = countExtendedFingers(landmarks, handedness);
    return {
      gestureId: null,
      gestureName: extended > 0 ? `${extended} finger(s) detected` : 'Hand detected',
      confidence: Math.min(40, extended * 10),
    };
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const confidence = Math.min(99, computeConfidence(candidates));

  return {
    gestureId: best.id,
    gestureName: best.id,
    confidence,
    rawScore: best.score,
  };
}

export function updateWristHistory(history, wrist, maxFrames = WAVE_HISTORY_FRAMES) {
  const next = [...history, { x: wrist.x, y: wrist.y, t: Date.now() }];
  return next.slice(-maxFrames);
}
