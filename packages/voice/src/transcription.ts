export type TranscriptionChunk = {
  text: string;
  isFinal: boolean;
};

export function combineChunks(chunks: TranscriptionChunk[]) {
  return chunks.map((chunk) => chunk.text).join(" ").trim();
}