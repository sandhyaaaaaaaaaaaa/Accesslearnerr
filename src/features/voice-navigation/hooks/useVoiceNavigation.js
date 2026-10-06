import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AppContext';
import { VOICE_COMMANDS } from '../constants/voiceCommands';
import { speakGesture } from '../../gesture-accessibility/utils/gestureSpeech';

export function useVoiceNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  
  const getRolePrefix = useCallback(() => {
    return user?.role === 'teacher' ? '/teacher' : '/student';
  }, [user]);

  const processCommand = useCallback((text) => {
    for (const command of VOICE_COMMANDS) {
      if (command.patterns.some(pattern => pattern.test(text))) {
        setFeedback(command.voiceResponse);
        speakGesture(command.voiceResponse); // Reuse the TTS utility from gesture feature
        
        switch (command.actionType) {
          case 'navigate':
            navigate(`${getRolePrefix()}${command.path}`);
            break;
          case 'back':
            window.history.back();
            break;
          case 'forward':
            window.history.forward();
            break;
          case 'stop':
            stopListening();
            break;
          default:
            break;
        }
        return true;
      }
    }
    return false;
  }, [navigate, getRolePrefix]);

  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('Listening for commands...');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.trim();
      setTranscript(`Heard: "${text}"`);
      
      const recognized = processCommand(text);
      if (!recognized) {
        setFeedback('Command not recognized.');
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied.');
      } else {
        // Ignore generic errors like 'no-speech' unless it's a hard error
        if (event.error !== 'no-speech') {
            setError(`Error: ${event.error}`);
        }
      }
      // If it's a real error, we stop
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If we manually stopped it, isListening will be updated by stopListening()
      // If it stopped automatically (e.g. timeout), restart it if we were supposed to be listening.
      // We will handle restarting externally if needed, or just let it stop.
      // For a global assistant, it's safer to just set to false and let the user restart, 
      // or implement an auto-restart loop if isListening is true.
      setIsListening(prev => {
        if (prev) {
          try {
            recognition.start();
            return true;
          } catch (e) {
            return false;
          }
        }
        return false;
      });
    };

    return recognition;
  }, [processCommand]);

  useEffect(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [initSpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Already started
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
      setTranscript('');
      setFeedback(null);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    feedback,
    error,
    startListening,
    stopListening,
    toggleListening
  };
}
