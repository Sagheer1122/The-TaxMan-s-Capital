import { useState, useEffect, useRef, useCallback } from 'react';

const COMMON_FILLERS = [
  'um',
  'uh',
  'like',
  'basically',
  'actually',
  'you know',
  'so',
  'literally',
  'sort of',
  'kind of',
  'right',
  'i mean'
];

/**
 * useVoiceInterviewEngine
 * High-performance, robust voice interaction engine for AI interview simulations.
 * Features:
 * - Controlled SpeechRecognition lifecycle with zero crashing on 'no-speech'
 * - Debounced auto-recovery with maximum retry guards
 * - Persona-based SpeechSynthesis (Technical Partner vs HR Lead)
 * - Real-time speaking pace (WPM) & filler word analytics
 */
export function useVoiceInterviewEngine({
  aiAudioEnabled = true,
  onSpeechFinalized = () => {},
  onSilenceDetected = null,
  silenceThresholdMs = 2600
} = {}) {
  // Speech Recognition state
  const [recognitionState, setRecognitionState] = useState('IDLE'); // 'IDLE' | 'STARTING' | 'LISTENING' | 'RECOGNIZED' | 'PROCESSING' | 'NO_SPEECH' | 'ERROR' | 'STOPPED'
  const [isMicListening, setIsMicListening] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [silenceCountdown, setSilenceCountdown] = useState(null);

  // Speech Synthesis state
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Real-time Speech Analytics
  const [turnSpeakingTime, setTurnSpeakingTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState({});

  // Internal References & Guards
  const recognitionRef = useRef(null);
  const isIntentListeningRef = useRef(false);
  const restartCooldownTimerRef = useRef(null);
  const turnTimerRef = useRef(null);
  const retryCountRef = useRef(0);
  const speakingStartTimeRef = useRef(null);
  const voicesRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const silenceIntervalRef = useRef(null);
  const latestTranscriptRef = useRef('');

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Compute Filler Words & WPM
  const analyzeSpeechText = useCallback((fullText, seconds) => {
    if (!fullText) return;
    const lower = fullText.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    // Detect fillers
    let count = 0;
    const foundFillers = {};

    COMMON_FILLERS.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        count += matches.length;
        foundFillers[filler] = matches.length;
      }
    });

    setFillerCount(count);
    setDetectedFillers(foundFillers);

    // Compute WPM
    if (seconds > 2) {
      const minutes = seconds / 60;
      const currentWpm = Math.round(totalWords / minutes);
      setWpm(currentWpm);
    }
  }, []);

  // Trigger silence watcher for auto-finalization when user stops speaking
  const triggerSilenceWatcher = useCallback(() => {
    if (!onSilenceDetected) return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);

    let remaining = Math.round(silenceThresholdMs / 1000);
    setSilenceCountdown(remaining);

    silenceIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setSilenceCountdown(remaining);
      } else {
        clearInterval(silenceIntervalRef.current);
      }
    }, 1000);

    silenceTimerRef.current = setTimeout(() => {
      setSilenceCountdown(null);
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
      if (isIntentListeningRef.current && !isAiSpeaking) {
        const text = latestTranscriptRef.current;
        if (text && text.trim().split(/\s+/).length >= 2) {
          onSilenceDetected(text.trim());
        }
      }
    }, silenceThresholdMs);
  }, [onSilenceDetected, silenceThresholdMs, isAiSpeaking]);

  // Stop Speech Recognition safely
  const stopListening = useCallback(() => {
    isIntentListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    setSilenceCountdown(null);

    if (restartCooldownTimerRef.current) {
      clearTimeout(restartCooldownTimerRef.current);
      restartCooldownTimerRef.current = null;
    }
    if (turnTimerRef.current) {
      clearInterval(turnTimerRef.current);
      turnTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsMicListening(false);
    setRecognitionState('STOPPED');
    setStatusMessage('');
  }, []);

  // Start Speech Recognition safely
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicPermissionError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setRecognitionState('ERROR');
      return;
    }

    setMicPermissionError(null);
    isIntentListeningRef.current = true;
    setRecognitionState('STARTING');
    setStatusMessage('Connecting microphone...');

    if (restartCooldownTimerRef.current) {
      clearTimeout(restartCooldownTimerRef.current);
      restartCooldownTimerRef.current = null;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsMicListening(true);
        setRecognitionState('LISTENING');
        setStatusMessage('Listening to you...');
        retryCountRef.current = 0;

        if (!speakingStartTimeRef.current) {
          speakingStartTimeRef.current = Date.now();
        }

        if (turnTimerRef.current) clearInterval(turnTimerRef.current);
        turnTimerRef.current = setInterval(() => {
          if (speakingStartTimeRef.current) {
            const elapsed = Math.round((Date.now() - speakingStartTimeRef.current) / 1000);
            setTurnSpeakingTime(elapsed);
          }
        }, 1000);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalized = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalized += chunk + ' ';
          } else {
            interim += chunk;
          }
        }

        setInterimText(interim);
        if (finalized || interim) {
          retryCountRef.current = 0; // Reset silence/retry count whenever active speech is registered
        }

        if (finalized) {
          setRecognitionState('RECOGNIZED');
          setStatusMessage('Speech detected');
          setLiveTranscript((prev) => {
            const updated = (prev + ' ' + finalized).trim();
            latestTranscriptRef.current = updated;
            const elapsed = speakingStartTimeRef.current
              ? Math.round((Date.now() - speakingStartTimeRef.current) / 1000)
              : 1;
            analyzeSpeechText(updated, elapsed);
            return updated;
          });
          triggerSilenceWatcher();
        } else if (interim) {
          // User is currently speaking an ongoing sentence
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
          setSilenceCountdown(null);
          setStatusMessage('Listening to your answer...');
        }
      };

      recognition.onerror = (event) => {
        const errType = event.error;

        // NON-FATAL / RECOVERABLE: 'no-speech'
        if (errType === 'no-speech') {
          setRecognitionState('NO_SPEECH');
          setStatusMessage("No speech detected. I'm still listening...");
          return;
        }

        // NON-FATAL: 'audio-capture' or 'network'
        if (errType === 'audio-capture' || errType === 'network') {
          console.warn('[VoiceEngine] Recoverable recognition error:', errType);
          setStatusMessage('Microphone signal reconnecting...');
          return;
        }

        // FATAL: 'not-allowed' or 'service-not-allowed'
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          console.warn('[VoiceEngine] Mic permission denied:', errType);
          setMicPermissionError('Microphone permission was denied. You can type your responses below.');
          setRecognitionState('ERROR');
          setIsMicListening(false);
          isIntentListeningRef.current = false;
        } else if (errType !== 'aborted') {
          console.warn('[VoiceEngine] Unhandled recognition error:', errType);
          setRecognitionState('ERROR');
        }
      };

      recognition.onend = () => {
        // Controlled, debounced restart if user intended to keep listening and AI is not speaking
        if (isIntentListeningRef.current && !isAiSpeaking) {
          if (retryCountRef.current < 100) {
            retryCountRef.current++;
            restartCooldownTimerRef.current = setTimeout(() => {
              if (isIntentListeningRef.current && !isAiSpeaking) {
                try {
                  recognition.start();
                } catch (e) {
                  // If recognition already running or state busy, gracefully maintain state
                  setIsMicListening(false);
                }
              }
            }, 250);
          } else {
            // After 100 silent timeouts, quietly restart counter and keep active
            retryCountRef.current = 0;
            setIsMicListening(false);
            setRecognitionState('LISTENING');
            setStatusMessage('Microphone active. Speak whenever you are ready.');
          }
        } else {
          setIsMicListening(false);
          if (recognitionState !== 'ERROR') {
            setRecognitionState('STOPPED');
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('[VoiceEngine] Recognition start error:', err.message);
      setIsMicListening(false);
      setRecognitionState('ERROR');
      setStatusMessage('Microphone unavailable. You can type your answers.');
    }
  }, [analyzeSpeechText, isAiSpeaking, recognitionState]);

  // Text-To-Speech with Persona Voice profiles
  const speakText = useCallback(
    (text, speakerRole = 'Senior Audit Manager (Technical)', onEnd = () => {}) => {
      if (typeof window === 'undefined' || !window.speechSynthesis || !aiAudioEnabled) {
        setIsAiSpeaking(false);
        onEnd();
        return;
      }

      window.speechSynthesis.cancel(); // Cancel any lingering utterances

      if (!text || text.trim() === '') {
        setIsAiSpeaking(false);
        onEnd();
        return;
      }

      // Temporarily pause speech recognition while AI speaks to prevent audio echo
      if (recognitionRef.current && isMicListening) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const cleanText = text.replace(/[*_#`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
      const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

      const isHR =
        speakerRole.toLowerCase().includes('hr') ||
        speakerRole.toLowerCase().includes('behavioral') ||
        speakerRole.toLowerCase().includes('culture') ||
        speakerRole.toLowerCase().includes('sana');

      if (isHR) {
        const femaleVoice = englishVoices.find((v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('karen')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.05;
        utterance.rate = 1.0;
      } else {
        const maleVoice = englishVoices.find((v) =>
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('george') ||
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('alex')
        );
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      }

      utterance.onstart = () => {
        setIsAiSpeaking(true);
      };

      utterance.onend = () => {
        setIsAiSpeaking(false);
        // Resume listening after 250ms buffer if intent was active
        setTimeout(() => {
          onEnd();
        }, 250);
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' occurs naturally when previous utterance is cleared
        if (e.error === 'interrupted' || e.error === 'canceled') {
          setIsAiSpeaking(false);
          return;
        }
        console.warn('[VoiceEngine] TTS event:', e.error || 'unhandled event');
        setIsAiSpeaking(false);
        onEnd();
      };

      window.speechSynthesis.speak(utterance);
    },
    [aiAudioEnabled, isMicListening]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (isMicListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isMicListening, startListening, stopListening]);

  // Reset Turn State for next question
  const resetTurnMetrics = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    setSilenceCountdown(null);
    latestTranscriptRef.current = '';
    setLiveTranscript('');
    setInterimText('');
    setTurnSpeakingTime(0);
    setWpm(0);
    setFillerCount(0);
    setDetectedFillers({});
    speakingStartTimeRef.current = null;
    retryCountRef.current = 0;
  }, []);

  // Centralized Full Engine Cleanup
  const cleanupVoiceEngine = useCallback(() => {
    stopListening();
    stopSpeaking();
    resetTurnMetrics();
  }, [stopListening, stopSpeaking, resetTurnMetrics]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      cleanupVoiceEngine();
    };
  }, [cleanupVoiceEngine]);

  return {
    recognitionState,
    isMicListening,
    micPermissionError,
    statusMessage,
    liveTranscript,
    setLiveTranscript,
    interimText,
    silenceCountdown,
    isAiSpeaking,
    turnSpeakingTime,
    wpm,
    fillerCount,
    detectedFillers,
    speakText,
    stopSpeaking,
    startListening,
    stopListening,
    toggleMic,
    resetTurnMetrics,
    cleanupVoiceEngine
  };
}
