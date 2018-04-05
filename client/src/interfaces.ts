export type ChunkInfo = number[]
export interface ChunkCollection {
  [key: string]: ChunkInfo
}
export interface EnvironmentState {
  chunks: ChunkCollection
}
export interface CellInfo {
  class: number,
  temperature: number,
  pressure: number,
  amount: number
}