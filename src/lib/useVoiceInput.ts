'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Cleanly extracts session speech text, removing cumulative repetitions common in Android Chrome
 */
export function extractCleanSessionText(results: any): string {
  if (!results || !results.length) return '';

  const phrases: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const text = results[i][0]?.transcript?.trim();
    if (!text) continue;

    if (phrases.length > 0) {
      const lastPhrase = phrases[phrases.length - 1];
      if (text.toLowerCase().startsWith(lastPhrase.toLowerCase())) {
        phrases[phrases.length - 1] = text;
        continue;
      }
    }

    phrases.push(text);
  }

  return phrases.join('\n');
}

export function useVoiceInput(onTranscriptUpdate: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);

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
      };

      recognition.onresult = (event: any) => {
        const cleanSessionText = extractCleanSessionText(event.results);
        if (cleanSessionText) {
          onTranscriptUpdateRef.current(cleanSessionText);
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
          // ignore
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
