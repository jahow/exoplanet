import {pushColoredQuad} from './utils.geom'
import {getScene} from './globals'
import {getGenericMaterial, getCellColor} from './mesh.materials'
import {ChunkInfo} from './interfaces'
import {decodeMaterialInfo} from '../../shared/src/materials'
import {CHUNK_SIZE} from '../../shared/src/globals'

export interface GridCell {
  class: number,
  amount: number,
  pressure: number,
  temperature: number
}

export class GridChunk {
	baseX: number
	baseY: number
	mesh: BABYLON.Mesh
	cells: GridCell[]
	revision: number

	constructor(baseX: number, baseY: number) {
		this.baseX = baseX
		this.baseY = baseY
		this.mesh = new BABYLON.Mesh(`chunk ${baseX} ${baseY}`, getScene())
		this.mesh.material = getGenericMaterial()
		this.mesh.visibility = 0.999
		this.mesh.position.x = baseX
		this.mesh.position.y = baseY
		this.cells = []
		this.revision = -1
	}

	updateChunk(encodedChunkInfo: ChunkInfo) {
		const revision = encodedChunkInfo[encodedChunkInfo.length - 1]
		if (revision === this.revision) { return }

		this.revision = revision

		for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
			this.cells[i] = decodeMaterialInfo(encodedChunkInfo[i])
		}

		this.generateMesh()
	}

	generateMesh() {
		let pos: number[] = []
		let col: number[] = []
		let ind: number[] = []
		let cell, cellIndex = 0
		for (let y = 0; y < CHUNK_SIZE; y++) {
			for (let x = 0; x < CHUNK_SIZE; x++) {
				cell = this.cells[cellIndex]
				pushColoredQuad(pos, col, ind,
					x, x + 1, y, y + 1,
					getCellColor(cell)
				)
				cellIndex++
			}
		}

    this.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos, true);
    this.mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, col, true);
    this.mesh.setIndices(ind, pos.length / 3, true)
	}

	dispose() {
		this.mesh.dispose()
	}
}