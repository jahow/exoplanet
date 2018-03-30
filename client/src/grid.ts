import {pushColoredQuad} from './utils.geom'
import {getScene} from './globals'

class GridChunk {
	baseX: number
	baseY: number
	mesh: BABYLON.Mesh

	constructor(baseX: number, baseY: number) {
		this.baseX = baseX
		this.baseY = baseY
		this.mesh = new BABYLON.Mesh(`chunk ${baseX} ${baseY}`, getScene())

		this.generateMesh()
	}

	generateMesh() {

	}
}

export default class Grid {
	chunks: GridChunk[]

	constructor() {
		// temp: generate 
		this.chunks = [
			new GridChunk(0, 0),
			new GridChunk(-32, 0),
			new GridChunk(-32, -32),
			new GridChunk(0, -32)
		]
	}
}