import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
export const voiceRecognition = {
    start: () => SpeechRecognition.startListening({ continuous: true }),
    stop: () => SpeechRecognition.stopListening(),
    hook: useSpeechRecognition
};
