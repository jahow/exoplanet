import { ExtendedMesh } from './utils.geom'
import { AnchorType, AnchorTypes, RenderingGroup, ContentFlow } from './enums'
import { getCanvas } from './globals'
import { getOverlayManager } from './utils.overlay'
import { generateTextMesh, measureText, TextParams } from './mesh.text'

type LayoutDimension = string | number

interface PanelComputedBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}
interface AnchorPosition {
  x: number
  y: number
}
interface PanelPosition {
  top?: LayoutDimension
  bottom?: LayoutDimension
  left?: LayoutDimension
  right?: LayoutDimension
}
interface PanelComputedSize {
  width: number
  height: number
}

const GUTTER = 20

let idCounter = 0

// utilities for computing panel bounds
function getCanvasBounds(): PanelComputedBounds {
  return {
    minX: 0,
    maxX: getCanvas().width,
    minY: 0,
    maxY: getCanvas().height
  }
}
function getCanvasSize(): PanelComputedSize {
  return {
    width: getCanvas().width,
    height: getCanvas().height
  }
}
function computeValue(value: LayoutDimension, parentValue: number): number {
  if (value === undefined || value === null) {
    return 0
  } else if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string') {
    // simple percentage
    if (value.substr(-1, 1) === '%') {
      const percentage = parseFloat(value.substr(0, value.length - 1))
      return Math.floor(percentage * 0.01 * parentValue)
    }

    // percentage with offset
    const matches = /([0-9]*)% ([-|+]) ([0-9]*)/.exec(value)
    if (matches !== null) {
      const percentage = parseFloat(matches[1])
      const sign = matches[2] === '+' ? 1 : -1
      const offset = parseFloat(matches[3])

      return Math.floor(percentage * 0.01 * parentValue + sign * offset)
    }

    // try a simple parseint
    return parseInt(value)
  } else {
    console.warn('Invalid layout dimension: ' + value)
    return 0
  }
}
function combineSizes(
  sizes: PanelComputedSize[],
  flow: ContentFlow
): PanelComputedSize {
  const widths = sizes.map(s => s.width)
  const heights = sizes.map(s => s.height)
  const sum = (array: number[]) => array.reduce((prev, curr) => prev + curr, 0)

  if (flow === ContentFlow.COL || flow === ContentFlow.COL_INVERSE) {
    return {
      width: Math.max.apply(this, widths),
      height: sum(heights)
    }
  } else {
    return {
      width: sum(widths),
      height: Math.max.apply(this, heights)
    }
  }
}
function computeAnchoredBounds(
  computedSize: PanelComputedSize,
  anchorType: AnchorType,
  anchorPosition: AnchorPosition
): PanelComputedBounds {
  const minX = anchorPosition.x - computedSize.width * anchorType[0]
  const minY = anchorPosition.y - computedSize.height * anchorType[1]
  return {
    minX,
    minY,
    maxX: minX + computedSize.width,
    maxY: minY + computedSize.height
  }
}
function computePositionedBounds(
  position: PanelPosition,
  size?: PanelComputedSize,
  frameBounds?: PanelComputedBounds
): PanelComputedBounds {
  const frame = frameBounds || getCanvasBounds()
  const mySize = size || {
    width: 20,
    height: 20
  }
  const frameWidth = frame.maxX - frame.minX
  const frameHeight = frame.maxY - frame.minY

  const minX =
    position.left !== undefined
      ? frame.minX + computeValue(position.left, frameWidth)
      : undefined
  const maxX =
    position.right !== undefined
      ? frame.minX + frameWidth - computeValue(position.right, frameWidth)
      : undefined
  const minY =
    position.bottom !== undefined
      ? frame.minY + computeValue(position.bottom, frameHeight)
      : undefined
  const maxY =
    position.top !== undefined
      ? frame.minY + frameHeight - computeValue(position.top, frameHeight)
      : undefined

  // cannot have two indeterminate values on one axis
  if (
    (minX === undefined && maxX === undefined) ||
    (minY === undefined && maxY === undefined)
  ) {
    console.warn(
      'Invalid UI panel position: at least one dimension is indefinite',
      position
    )
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
    }
  }

  return {
    minX: minX !== undefined ? minX : maxX - mySize.width,
    maxX: maxX !== undefined ? maxX : minX + mySize.width,
    minY: minY !== undefined ? minY : maxY - mySize.height,
    maxY: maxY !== undefined ? maxY : minY + mySize.height
  }
}
function computePositionedSize(
  position: PanelPosition,
  frameSize?: PanelComputedSize
): PanelComputedSize {
  const frame = frameSize || getCanvasSize()

  // cannot have two indeterminate values on one axis
  if (
    (position.left === undefined && position.right === undefined) ||
    (position.bottom === undefined && position.top === undefined)
  ) {
    console.warn(
      'Invalid UI panel position: at least one dimension is indefinite',
      position
    )
    return {
      width: 20,
      height: 20
    }
  }

  return {
    width:
      position.left === undefined || position.right === undefined
        ? 20
        : Math.max(
            20,
            frame.width -
              computeValue(position.right, frame.width) -
              computeValue(position.left, frame.width)
          ),
    height:
      position.bottom === undefined || position.top === undefined
        ? 20
        : Math.max(
            20,
            frame.height -
              computeValue(position.top, frame.height) -
              computeValue(position.bottom, frame.height)
          )
  }
}
function computeAnchorPosition(
  anchorType: AnchorType,
  bounds: PanelComputedBounds
): AnchorPosition {
  return {
    x: bounds.minX + (bounds.maxX - bounds.minX) * anchorType[0],
    y: bounds.minY + (bounds.maxY - bounds.minY) * anchorType[1]
  }
}
function shiftAnchorPosition(
  flow: ContentFlow,
  anchorPosition: AnchorPosition,
  shift: PanelComputedSize
): AnchorPosition {
  return {
    x:
      anchorPosition.x +
      (flow === ContentFlow.ROW
        ? shift.width
        : flow === ContentFlow.ROW_INVERSE ? -shift.width : 0),
    y:
      anchorPosition.y +
      (flow === ContentFlow.COL
        ? shift.height
        : flow === ContentFlow.COL_INVERSE ? -shift.height : 0)
  }
}

interface BaseAttributes {
  position?: PanelPosition
  childAnchor?: AnchorType
  childFlow?: ContentFlow
}

const BaseDefaultAttributes = {
  childAnchor: AnchorTypes.BOTTOMLEFT,
  childFlow: ContentFlow.ROW
}

export class BasePanel {
  id: number
  attrs: BaseAttributes
  parent: BasePanel
  children: BasePanel[]
  protected _computedSize: PanelComputedSize
  protected _lastBounds: PanelComputedBounds

  constructor(attrs: BaseAttributes) {
    this.id = idCounter++
    this.attrs = Object.assign({}, BaseDefaultAttributes, attrs)
    this.children = []
  }

  setParent(panel: BasePanel) {
    this.parent = panel
    panel.registerChild(this)
  }

  getSize(): PanelComputedSize {
    if (!this._computedSize) {
      this.computeSize()
    }

    return this._computedSize
  }

  computeSize() {
    const frameSize = this.parent && this.parent.getSize()

    // use position if available
    if (this.isPositioned()) {
      this._computedSize = computePositionedSize(this.attrs.position, frameSize)
      return
    }

    this._computedSize = {
      width: 20,
      height: 20
    }
  }

  regenerate(
    anchorType: AnchorType,
    anchorPosition: AnchorPosition,
    parentBounds?: PanelComputedBounds
  ) {}

  update() {}

  invalidate() {
    this._computedSize = null
    this._lastBounds = null
  }

  hasParent() {
    return !!this.parent
  }

  isPositioned() {
    return this.attrs.position !== undefined
  }

  private registerChild(panel: BasePanel) {
    this.children.indexOf(panel) === -1 && this.children.push(panel)
  }
}

interface PanelAttributes extends BaseAttributes {
  hasBorder?: boolean
  hasBackground?: boolean
}
const PanelDefaultAttributes = {
  hasBackground: true,
  hasBorder: true
}

export class OverlayPanel extends BasePanel {
  mesh: ExtendedMesh
  attrs: PanelAttributes

  constructor(attrs: PanelAttributes) {
    super(Object.assign({}, PanelDefaultAttributes, attrs))

    this.mesh = new ExtendedMesh('panel', getOverlayManager().getScene())
    this.mesh.renderingGroupId = RenderingGroup.OVERLAY
    this.mesh.visibility = 0.9999
    this.mesh.alwaysSelectAsActiveMesh = true
    this.mesh.material = getOverlayManager().getPanelMaterial()
  }

  computeSize() {
    // try to compute size using base class first
    super.computeSize()

    // apply auto width&height based on child sizes
    const childrenSizes = this.children
      .filter(c => !c.isPositioned())
      .map(c => c.getSize())
    const combined = combineSizes(childrenSizes, this.attrs.childFlow)

    this._computedSize.width = Math.max(
      this._computedSize.width,
      combined.width
    )
    this._computedSize.height = Math.max(
      this._computedSize.height,
      combined.height
    )

    return this._computedSize
  }

  regenerate(
    anchorType: AnchorType,
    anchorPosition: AnchorPosition,
    parentBounds?: PanelComputedBounds
  ) {
    if (!this.isPositioned()) {
      this._lastBounds = computeAnchoredBounds(
        this.getSize(),
        anchorType,
        anchorPosition
      )
    } else {
      this._lastBounds = computePositionedBounds(
        this.attrs.position,
        this.getSize(),
        parentBounds
      )
    }

    // generate quad
    this.mesh
      .clearVertices()
      .pushQuad({
        ...this._lastBounds,
        color: BABYLON.Color4.FromInts(
          100,
          100,
          100,
          this.attrs.hasBackground ? 200 : 0
        )
      })
      .commit()

    // position children in the flow
    let anchorPos = computeAnchorPosition(
      this.attrs.childAnchor,
      this._lastBounds
    )
    this.children.forEach(panel => {
      panel.regenerate(this.attrs.childAnchor, anchorPos, this._lastBounds)
      if (!panel.isPositioned()) {
        anchorPos = shiftAnchorPosition(
          this.attrs.childFlow,
          anchorPos,
          panel.getSize()
        )
      }
    })
  }
}

interface TextAttributes extends BaseAttributes {
  maxWidth?: LayoutDimension
}

const overlayTextParams: TextParams = {
  fontFamily: 'arial',
  fontWeight: 'normal',
  charHeight: 16
}

export class OverlayText extends BasePanel {
  mesh: ExtendedMesh
  attrs: TextAttributes
  text: string

  constructor(attrs: TextAttributes, text: string) {
    super(attrs)
    this.text = text
    this.mesh = new ExtendedMesh('overlay-text', getOverlayManager().getScene())
  }

  computeSize() {
    this._computedSize = measureText({
      params: overlayTextParams,
      text: this.text
    })
  }

  regenerate(
    anchorType: AnchorType,
    anchorPosition: AnchorPosition,
    parentBounds?: PanelComputedBounds
  ) {
    this._lastBounds = computeAnchoredBounds(
      this.getSize(),
      anchorType,
      anchorPosition
    )
    this.mesh = generateTextMesh({
      params: overlayTextParams,
      text: this.text,
      position: new BABYLON.Vector2(
        this._lastBounds.minX,
        this._lastBounds.minY
      ),
      anchor: AnchorTypes.BOTTOMLEFT,
      color: BABYLON.Color4.FromInts(255, 255, 255, 255),
      existingMesh: this.mesh
    })
  }
}
