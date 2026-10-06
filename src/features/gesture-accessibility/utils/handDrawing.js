import { HAND_CONNECTIONS } from '../constants/gestureMappings';

export function drawHandLandmarks(ctx, landmarks, width, height) {
  if (!landmarks?.length) return;

  ctx.clearRect(0, 0, width, height);

  // Connections
  ctx.strokeStyle = '#14b8a6';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  for (const [start, end] of HAND_CONNECTIONS) {
    const s = landmarks[start];
    const e = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(s.x * width, s.y * height);
    ctx.lineTo(e.x * width, e.y * height);
    ctx.stroke();
  }

  // Landmarks
  landmarks.forEach((lm, i) => {
    const x = lm.x * width;
    const y = lm.y * height;
    const isTip = [4, 8, 12, 16, 20].includes(i);

    ctx.beginPath();
    ctx.arc(x, y, isTip ? 6 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = isTip ? '#f97316' : '#0d9488';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}
