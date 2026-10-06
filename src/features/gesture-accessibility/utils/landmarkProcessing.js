/**
 * Normalizes a set of 3D landmarks to be translation and scale invariant.
 * This is crucial for robust ML classification so that distance from camera
 * or hand position on screen doesn't affect the model's predictions.
 * 
 * @param {Array<{x, y, z}>} landmarks - The 21 hand landmarks from MediaPipe
 * @returns {Array<{x, y, z}>} Normalized landmarks
 */
export function normalizeLandmarks(landmarks) {
  if (!landmarks || landmarks.length !== 21) return landmarks;

  // 1. Translation: Make the wrist (landmark 0) the origin
  const wrist = landmarks[0];
  const translated = landmarks.map(point => ({
    x: point.x - wrist.x,
    y: point.y - wrist.y,
    z: point.z - wrist.z
  }));

  // 2. Scale: Find the maximum absolute value across all coordinates
  let maxDist = 0;
  for (const point of translated) {
    const dist = Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z));
    if (dist > maxDist) maxDist = dist;
  }

  // Prevent division by zero
  if (maxDist === 0) maxDist = 1;

  // 3. Apply scaling
  const normalized = translated.map(point => ({
    x: point.x / maxDist,
    y: point.y / maxDist,
    z: point.z / maxDist
  }));

  return normalized;
}

/**
 * Converts normalized landmarks into a flat 1D array feature vector.
 * Useful for feeding into ML models like KNN or SVM.
 * 
 * @param {Array<{x, y, z}>} landmarks 
 * @returns {Array<number>} 63-element array
 */
export function extractFeatureVector(landmarks) {
  const normalized = normalizeLandmarks(landmarks);
  const vector = [];
  for (const point of normalized) {
    vector.push(point.x, point.y, point.z);
  }
  return vector;
}
