export class ExtendedMesh extends BABYLON.Mesh {
  _tempArrays: {
    positions: Array<number>
    colors: Array<number>
    uvs: Array<number>
    indices: Array<number>
  }
  _baseIndex: number

  constructor(
    name: string,
    scene?: BABYLON.Scene,
    parent?: BABYLON.Node,
    source?: BABYLON.Mesh,
    doNotCloneChildren?: boolean,
    clonePhysicsImpostor?: boolean
  ) {
    super(name, scene, parent, source, doNotCloneChildren, clonePhysicsImpostor)

    this._tempArrays = {
      positions: null,
      colors: null,
      uvs: null,
      indices: null
    }
    this._baseIndex = 0
  }

  clearVertices() {
    this._tempArrays = {
      positions: [],
      colors: [],
      uvs: [],
      indices: []
    }
    return this
  }

  private _pushPositions(...positions: Array<number>) {
    if (this._tempArrays.positions === null) {
      this._tempArrays.positions =
        (this.getVerticesData(
          BABYLON.VertexBuffer.PositionKind,
          false,
          true
        ) as Array<number>) || []
    }
    const stride = 3
    this._baseIndex = this._tempArrays.positions.length / stride
    Array.prototype.push.apply(this._tempArrays.positions, positions)
  }
  private _pushColors(...colors: Array<number>) {
    if (this._tempArrays.colors === null) {
      this._tempArrays.colors =
        (this.getVerticesData(
          BABYLON.VertexBuffer.ColorKind,
          false,
          true
        ) as Array<number>) || []
    }
    Array.prototype.push.apply(this._tempArrays.colors, colors)
  }
  private _pushUVs(...uvs: Array<number>) {
    if (this._tempArrays.uvs === null) {
      this._tempArrays.uvs =
        (this.getVerticesData(
          BABYLON.VertexBuffer.UVKind,
          false,
          true
        ) as Array<number>) || []
    }
    Array.prototype.push.apply(this._tempArrays.uvs, uvs)
  }
  private _pushIndices(...indices: Array<number>) {
    if (this._tempArrays.indices === null) {
      this._tempArrays.indices = (this.getIndices() as Array<number>).slice()
    }
    Array.prototype.push.apply(
      this._tempArrays.indices,
      indices.map(i => i + this._baseIndex)
    )
  }

  // applies all pending modifications to the mesh
  commit() {
    if (this._tempArrays.positions !== null) {
      this.setVerticesData(
        BABYLON.VertexBuffer.PositionKind,
        this._tempArrays.positions
      )
    }
    if (this._tempArrays.colors !== null) {
      this.setVerticesData(
        BABYLON.VertexBuffer.ColorKind,
        this._tempArrays.colors
      )
    }
    if (this._tempArrays.uvs !== null) {
      this.setVerticesData(BABYLON.VertexBuffer.UVKind, this._tempArrays.uvs)
    }
    if (this._tempArrays.indices !== null) {
      this.setIndices(this._tempArrays.indices)
    }
    this._tempArrays.positions = null
    this._tempArrays.colors = null
    this._tempArrays.uvs = null
    this._tempArrays.indices = null
  }

  /**
   * Will push a quad into the given mesh
   */
  pushQuad(properties: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    color?: BABYLON.Color4
    minU?: number
    maxU?: number
    minV?: number
    maxV?: number
  }) {
    this._pushPositions(
      properties.minX,
      properties.minY,
      0,
      properties.maxX,
      properties.minY,
      0,
      properties.maxX,
      properties.maxY,
      0,
      properties.minX,
      properties.maxY,
      0
    )
    const color =
      properties.color || BABYLON.Color4.FromInts(255, 255, 255, 255)
    this._pushColors(
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a,
      color.r,
      color.g,
      color.b,
      color.a
    )
    this._pushUVs(
      properties.minU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.minV || 0,
      properties.maxU || 0,
      properties.maxV || 0,
      properties.minU || 0,
      properties.maxV || 0
    )

    this._pushIndices(0, 1, 2, 0, 2, 3)

    return this
  }
}
