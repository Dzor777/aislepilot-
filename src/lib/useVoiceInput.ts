'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoiceInput(onTranscriptUpdate: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const lastProcessedIndexRef = useRef<number>(-1);
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);

  // Keep callback ref updated to prevent useEffect re-runs
  useEffect(() => {
    onTranscriptUpdateRef.current = onTranscriptUpdate;
  }, [onTranscriptUpdate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        lastProcessedIndexRef.current = -1;
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal && i > lastProcessedIndexRef.current) {
            const transcript = event.results[i][0].transcript.trim();
            if (transcript) {
              finalChunk += transcript + '\n';
            }
            lastProcessedIndexRef.current = i;
          }
        }

        if (finalChunk.trim()) {
          onTranscriptUpdateRef.current(finalChunk.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore cleanup errors
        }
      };
    } catch (e) {
      console.warn('Failed to initialize speech recognition', e);
      setIsSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Error starting speech recognition', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.warn('Error stopping speech recognition', e);
      }
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
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
