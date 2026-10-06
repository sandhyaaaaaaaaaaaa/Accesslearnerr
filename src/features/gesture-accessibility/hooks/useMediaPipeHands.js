import { useCallback, useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { drawHandLandmarks } from '../utils/handDrawing';
import { recognizeGesture, updateWristHistory } from '../utils/gestureRecognizer';
import { extractFeatureVector } from '../utils/landmarkProcessing';
import { GESTURE_DEFINITIONS, MEDIAPIPE_WASM_PATH, HAND_LANDMARKER_MODEL } from '../constants/gestureMappings';

const SMOOTHING_FRAMES = 5;

export function useMediaPipeHands({ onGestureAction }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const wristHistoryRef = useRef([]);
  const lastGestureRef = useRef(null);
  const predictionHistoryRef = useRef([]);
  const onGestureActionRef = useRef(onGestureAction);

  onGestureActionRef.current = onGestureAction;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [detection, setDetection] = useState({
    gestureId: null,
    gestureName: 'Waiting for hand…',
    confidence: 0,
    handedness: null,
    featureVector: null,
  });

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const ctx = canvas.getContext('2d');
    const { videoWidth, videoHeight } = video;

    if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }

    const results = landmarker.detectForVideo(video, performance.now());

    if (results.landmarks?.length > 0) {
      const landmarks = results.landmarks[0];
      const handedness = results.handednesses?.[0]?.[0]?.categoryName || 'Right';
      const handednessScore = results.handednesses?.[0]?.[0]?.score || 0;

      drawHandLandmarks(ctx, landmarks, videoWidth, videoHeight);

      // Extract ML-ready feature vector (Normalized 63D array)
      const featureVector = extractFeatureVector(landmarks);

      wristHistoryRef.current = updateWristHistory(wristHistoryRef.current, landmarks[0]);

      // Note: In a full ML implementation, recognizeGesture would process `featureVector`
      // instead of raw landmarks. We use the robust heuristic placeholders here.
      const result = recognizeGesture(landmarks, handedness, wristHistoryRef.current);
      const definition = GESTURE_DEFINITIONS.find((g) => g.id === result.gestureId);
      const displayName = definition?.name || result.gestureName;

      const blendedConfidence = result.gestureId
        ? Math.min(99, Math.round(result.confidence * 0.7 + handednessScore * 100 * 0.3))
        : result.confidence;

      setDetection({
        gestureId: result.gestureId,
        gestureName: displayName,
        confidence: blendedConfidence,
        handedness,
        featureVector,
      });

      // Temporal Smoothing Pipeline
      if (result.gestureId && blendedConfidence >= 70) {
        predictionHistoryRef.current.push(result.gestureId);
        if (predictionHistoryRef.current.length > SMOOTHING_FRAMES) {
          predictionHistoryRef.current.shift();
        }

        // Check if all frames in the window predict the same gesture
        const isStable = predictionHistoryRef.current.length === SMOOTHING_FRAMES &&
                         predictionHistoryRef.current.every(id => id === result.gestureId);

        if (isStable && result.gestureId !== lastGestureRef.current) {
          const acted = onGestureActionRef.current?.(result.gestureId);
          if (acted) {
            lastGestureRef.current = result.gestureId;
          }
        }
      } else {
        predictionHistoryRef.current = [];
        if (!result.gestureId) {
          lastGestureRef.current = null;
        }
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      wristHistoryRef.current = [];
      predictionHistoryRef.current = [];
      lastGestureRef.current = null;
      setDetection({
        gestureId: null,
        gestureName: 'No hand detected',
        confidence: 0,
        handedness: null,
        featureVector: null,
      });
    }

    animationRef.current = requestAnimationFrame(detectLoop);
  }, []);

  const initLandmarker = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;

    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_PATH);

    try {
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
    } catch {
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
    }

    return landmarkerRef.current;
  }, []);

  const start = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      const video = videoRef.current;
      if (!video) throw new Error('Video element not ready');

      video.srcObject = stream;
      await video.play();

      await initLandmarker();

      wristHistoryRef.current = [];
      lastGestureRef.current = null;
      setIsActive(true);
      animationRef.current = requestAnimationFrame(detectLoop);
    } catch (err) {
      setError(err.message || 'Failed to access webcam or load MediaPipe Hands.');
      stopCamera();
    } finally {
      setIsLoading(false);
    }
  }, [detectLoop, stopCamera, initLandmarker]);

  const stop = useCallback(() => {
    stopCamera();
    wristHistoryRef.current = [];
    lastGestureRef.current = null;
    setDetection({
      gestureId: null,
      gestureName: 'Gesture control stopped',
      confidence: 0,
      handedness: null,
    });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    error,
    isActive,
    detection,
    start,
    stop,
  };
}
