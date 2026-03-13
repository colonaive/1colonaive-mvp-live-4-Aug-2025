// Chief-of-Staff — Voice Input Module
// Browser-based speech recognition for CEO voice dictation.

export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
}

// Check browser support — SpeechRecognition is vendor-prefixed in most browsers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const voiceInput = {
  /** Check if speech recognition is supported */
  isSupported(): boolean {
    return !!SpeechRecognition;
  },

  /** Start voice recognition and return results via callbacks */
  startListening(callbacks: {
    onResult: (transcript: string) => void;
    onError: (error: string) => void;
    onEnd: () => void;
  }): { stop: () => void } | null {
    if (!SpeechRecognition) {
      callbacks.onError('Speech recognition not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-SG';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0];
      callbacks.onResult(result.transcript);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      callbacks.onError(`Voice recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      callbacks.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // Already stopped
        }
      },
    };
  },
};
