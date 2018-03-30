export type ChunkInfo = number[]
export interface ChunkCollection {
  [key: string]: ChunkInfo
}
export interface EnvironmentState {
  chunks: ChunkCollection
}
