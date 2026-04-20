declare module "react-speech-recognition" {
  export type UseSpeechRecognitionResult = {
    transcript: string;
    listening: boolean;
    browserSupportsSpeechRecognition: boolean;
    resetTranscript: () => void;
  };

  export function useSpeechRecognition(): UseSpeechRecognitionResult;

  const SpeechRecognition: {
    startListening: (options?: { continuous?: boolean }) => Promise<void> | void;
    stopListening: () => Promise<void> | void;
  };

  export default SpeechRecognition;
}