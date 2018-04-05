import {ViewExtent} from './interfaces'
import {getCanvas, getEngine, getScene} from './globals'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {updateInputState, isKeyPressed, KeyCode} from './utils.input'
import {handleViewMove} from './events.network'

const DEFAULT_VIEW_EXTENT = 220

// unit per second
const VIEW_PAN_SPEED = 100

let camera: BABYLON.Camera

/**
 * Init camera
 */
export function initView() {
  camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 10,
    new BABYLON.Vector3(16, 16, 0), getScene())

  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
  adjustView(BABYLON.Vector2.Zero(), 1)
}

export function getCamera(): BABYLON.Camera {
  return camera
}


/**
 * Set an ortho camera to point a target position with a specified distance
 * note: distance is the factor applied to the default view size
 */
export function adjustView(target: BABYLON.Vector2, distance: number) {
  const canvas = getCanvas()
  const ratio = canvas.width / canvas.height
  let width = DEFAULT_VIEW_EXTENT * distance
  let height = width / ratio

  camera.orthoBottom = target.y - height / 2
  camera.orthoTop = target.y + height / 2
  camera.orthoLeft = target.x - width / 2
  camera.orthoRight = target.x + width / 2
}

/**
 * Same but with relative effect (values are added)
 */
export function adjustViewRelative(targetDiff: BABYLON.Vector2, distanceDiff: number) {
  const target = new BABYLON.Vector2(
    targetDiff.x + (camera.orthoLeft + camera.orthoRight) / 2,
    targetDiff.y + (camera.orthoBottom + camera.orthoTop) / 2
  )
  let distance = distanceDiff +
    (camera.orthoRight - camera.orthoLeft) / DEFAULT_VIEW_EXTENT

  adjustView(target, distance)
}


/**
 * Returns an extent (min/max X, min/max Y) from a camera
 * Extent is then rounded on grid chunks
 */
export function getViewExtent(): ViewExtent {
  let canvas = getCanvas()
  let ratio = canvas.width / canvas.height

  const extent = {
    minX: camera.orthoLeft,
    maxX: camera.orthoRight,
    minY: camera.orthoBottom,
    maxY: camera.orthoTop
  }

  // round on chunks
  extent.minX = Math.floor(extent.minX / CHUNK_SIZE) * CHUNK_SIZE
  extent.minY = Math.floor(extent.minY / CHUNK_SIZE) * CHUNK_SIZE
  extent.maxX = Math.ceil(extent.maxX / CHUNK_SIZE) * CHUNK_SIZE
  extent.maxY = Math.ceil(extent.maxY / CHUNK_SIZE) * CHUNK_SIZE

  return extent
}

/**
 * Compare two extents; returns true if different
 */
export function compareExtents(extent1: ViewExtent, extent2: ViewExtent): boolean {
  return extent1.minX !== extent2.minX ||
    extent1.minY !== extent2.minY ||
    extent1.maxX !== extent2.maxX ||
    extent1.maxY !== extent2.maxY
}

const viewDiff = BABYLON.Vector2.Zero()
let previousExtent: ViewExtent, newExtent

/**
 * Run this on the update loop to update the view according to pressed keys
 */
export function updateView() {
  // move camera
  viewDiff.scaleInPlace(0)
  const delta = getEngine().getDeltaTime()
  if (isKeyPressed(KeyCode.DOWN)) viewDiff.y -= 1
  if (isKeyPressed(KeyCode.UP)) viewDiff.y += 1
  if (isKeyPressed(KeyCode.LEFT)) viewDiff.x -= 1
  if (isKeyPressed(KeyCode.RIGHT)) viewDiff.x += 1
  viewDiff.scaleInPlace(delta * 0.001 * VIEW_PAN_SPEED)
  adjustViewRelative(viewDiff, 0)

  // check if extent has changed
  newExtent = getViewExtent()
  if (!previousExtent || compareExtents(newExtent, previousExtent)) {
    handleViewMove()
  }
  previousExtent = newExtent
}