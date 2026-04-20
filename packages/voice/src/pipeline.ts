import { combineChunks, type TranscriptionChunk } from "./transcription";

export function buildVoiceCommand(chunks: TranscriptionChunk[]) {
  return combineChunks(chunks).replace(/\s+/g, " ");
}