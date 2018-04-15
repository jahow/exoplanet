import {ViewExtent} from './interfaces'
import {getCanvas, getEngine, getScene} from './globals'
import {CHUNK_SIZE} from '../../shared/src/globals'
import {updateInputState, isKeyPressed, KeyCode} from './utils.input'
import {handleViewMove} from './events.network'

const DEFAULT_VIEW_RESOLUTION = 0.25    // meters per pixel

// unit per second
const VIEW_PAN_SPEED = 100

let camera: BABYLON.Camera
let currentTarget = BABYLON.Vector2.Zero()
let currentResolution = DEFAULT_VIEW_RESOLUTION

/**
 * Init camera
 */
export function initView() {
  camera = new BABYLON.ArcRotateCamera('main',
    -Math.PI / 2, Math.PI / 2, 10,
    new BABYLON.Vector3(16, 16, 0), getScene())

  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
  moveView(BABYLON.Vector2.Zero())
}

export function getCamera(): BABYLON.Camera {
  return camera
}

function updateCameraParams() {
  const canvas = getCanvas()
  let width = canvas.width * currentResolution
  let height = canvas.height * currentResolution
  let targetX = currentTarget.x
  let targetY = currentTarget.y

  const floor = (a: number) => Math.floor(a / currentResolution) * currentResolution

  camera.orthoBottom = floor(targetY - height / 2)
  camera.orthoTop = floor(targetY + height / 2)
  camera.orthoLeft = floor(targetX - width / 2)
  camera.orthoRight = floor(targetX + width / 2)
}

/**
 * Set an ortho camera to point a target position
 */
export function moveView(target: BABYLON.Vector2) {
  currentTarget.set(target.x, target.y)
  updateCameraParams()
}

/**
 * Set an ortho camera to the specified resolution
 */
export function setResolution(resolution: number) {
  currentResolution = resolution
  updateCameraParams()
}

/**
 * Same but with relative effect (values are added)
 */
export function moveViewRelative(targetDiff: BABYLON.Vector2) {
  const target = new BABYLON.Vector2(
    targetDiff.x + currentTarget.x,
    targetDiff.y + currentTarget.y
  )

  moveView(target)
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
  viewDiff.scaleInPlace(delta * 0.0011 * VIEW_PAN_SPEED)
  moveViewRelative(viewDiff)

  // check if extent has changed
  newExtent = getViewExtent()
  if (!previousExtent || compareExtents(newExtent, previousExtent)) {
    handleViewMove()
  }
  previousExtent = newExtent
}