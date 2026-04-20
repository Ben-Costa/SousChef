export type RecognitionResult = {
  transcript: string;
  confidence?: number;
};

export function normalizeTranscript(result: RecognitionResult) {
  return result.transcript.trim().toLowerCase();
}