import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AppContext';
import { GESTURE_IDS, GESTURE_DEFINITIONS, GESTURE_COOLDOWN_MS } from '../constants/gestureMappings';
import { speakGesture, pauseReading } from '../utils/gestureSpeech';

export function useGestureNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const lastActionRef = useRef({ gestureId: null, time: 0 });

  const getRolePrefix = useCallback(() => {
    return user?.role === 'teacher' ? '/teacher' : '/student';
  }, [user]);

  const executeGestureAction = useCallback(
    (gestureId) => {
      if (!gestureId) return false;

      const now = Date.now();
      if (
        lastActionRef.current.gestureId === gestureId &&
        now - lastActionRef.current.time < GESTURE_COOLDOWN_MS
      ) {
        return false;
      }

      const definition = GESTURE_DEFINITIONS.find((g) => g.id === gestureId);
      if (!definition) return false;

      if (!definition.action) return false;

      const prefix = getRolePrefix();
      const { type, payload } = definition.action;

      if (type === 'navigate') {
        // If payload is root '/', and user exists, we might navigate to dashboard instead.
        if (payload === '/' && user) {
          navigate(`${prefix}/dashboard`);
        } else {
          navigate(payload.startsWith('/') && payload !== '/' ? `${prefix}${payload}` : payload);
        }
      } else if (type === 'forward') {
        window.history.forward();
      } else if (type === 'back') {
        window.history.back();
      } else if (type === 'callback') {
        if (payload === 'pauseReading') {
          pauseReading();
        }
        // Future callbacks can be added here
      } else {
        return false;
      }

      speakGesture(definition.voice);
      lastActionRef.current = { gestureId, time: now };
      return true;
    },
    [navigate, getRolePrefix, user]
  );

  return { executeGestureAction };
}
