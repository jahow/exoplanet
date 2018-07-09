import * as TinySDF from 'tiny-sdf'
import { arrayFromRange } from './utils.misc'
import { ExtendedMesh } from './utils.geom'
import { getScene } from './globals'
import { AnchorType } from './enums'

interface GlyphInfo {
  widthRatio: number // width / height
  minU: number
  maxU: number
  minV: number
  maxV: number
}

interface FontBundle {
  key: string
  material: BABYLON.Material
  glyphs: { [key: string]: GlyphInfo }
  defaultGlyph: GlyphInfo
  bufferRatio: number // buffer / height,
  scene: BABYLON.Scene
}

const bundles: FontBundle[] = []

/**
 * Will return a FontBundle with a material and info on contained glyphs
 */
function generateFontBundle(
  fontFamily: string,
  fontWeight: 'normal' | 'bold',
  scene?: BABYLON.Scene
): FontBundle {
  const textMaterial = new BABYLON.ShaderMaterial(
    'text',
    scene || getScene(),
    './text-shader',
    {
      attributes: ['position', 'color', 'uv'],
      uniforms: ['worldViewProjection', 'gamma', 'buffer'],
      samplers: ['glyphAtlas']
    }
  )
  textMaterial.backFaceCulling = false

  // this will contain all the glyphs info
  const glyphs: { [key: string]: GlyphInfo } = {}

  // generate texture
  // atlases are 1024x1024 with 16 rows of glyphs
  const textureSize = 1024
  const rowHeight = 64
  const buffer = 4
  const fontSize = rowHeight - buffer * 2

  const texture = new BABYLON.DynamicTexture(
    'glyphs',
    {
      width: textureSize,
      height: textureSize
    },
    getScene(),
    false
  )
  const ctx = texture.getContext()
  ctx.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily
  ctx.textBaseline = 'middle'

  // chars to draw
  // for now: latin basic and latin extended
  const chars =
    String.fromCharCode.apply(this, arrayFromRange(0x20, 0x7f)) +
    String.fromCharCode.apply(this, arrayFromRange(0xa0, 0xff)) +
    '☹'

  // draw text
  const sdfGenerator = new TinySDF(
    fontSize,
    buffer,
    8,
    0.25,
    fontFamily,
    fontWeight
  )
  let x = 0,
    y = 0,
    width,
    values: ImageData,
    array,
    char,
    charIndex = 0
  while (charIndex < chars.length) {
    char = chars.substr(charIndex, 1)
    width = Math.ceil(ctx.measureText(char).width) + buffer * 2
    values = sdfGenerator.draw(char)

    if (x + width >= textureSize) {
      x = 0
      y += rowHeight
    }

    glyphs[char] = {
      widthRatio: Math.ceil(ctx.measureText(char).width) / fontSize,
      minU: x / textureSize,
      maxU: (x + width) / textureSize,
      minV: 1 - (y + rowHeight) / textureSize,
      maxV: 1 - y / textureSize
    }

    ctx.putImageData(values, x, y, 0, 0, width, rowHeight)
    x += width
    charIndex++
  }

  texture.update()

  textMaterial.setTexture('glyphAtlas', texture)
  textMaterial.setFloat('buffer', 0.68)
  textMaterial.setFloat('gamma', 0.13)

  return {
    key: fontFamily + '#' + fontWeight,
    scene: textMaterial.getScene(),
    material: textMaterial,
    bufferRatio: buffer / fontSize,
    glyphs,
    defaultGlyph: glyphs[chars[chars.length - 1]] // last glyph is the default one
  }
}

/**
 * Generates a mesh for text rendering
 * Optional: give an existing mesh as argument to reuse it
 */
export function generateTextMesh(
  fontFamily: string,
  fontWeight: 'normal' | 'bold',
  text: string,
  charHeight: number,
  position: BABYLON.Vector2,
  anchor: AnchorType,
  color?: BABYLON.Color4,
  existingMesh?: ExtendedMesh
): ExtendedMesh {
  const mesh = existingMesh || new ExtendedMesh('text', getScene())
  let color_ = color || BABYLON.Color4.FromInts(255, 255, 255, 255)

  // font bundle (reuse if available)
  const key = fontFamily + '#' + fontWeight
  let bundle = bundles.find(
    bundle => bundle.key === key && bundle.scene == mesh.getScene()
  )
  if (!bundle) {
    bundle = generateFontBundle(fontFamily, fontWeight, mesh.getScene())
    bundles.push(bundle)
  }

  // generate mesh vertices
  mesh.material = bundle.material
  mesh.visibility = 0.9999
  mesh.renderingGroupId = 3
  mesh.isPickable = false
  mesh.clearVertices()

  // compute global width & height and start position
  const chars = text.split('')
  const buffer = bundle.bufferRatio * charHeight
  const totalWidth = chars.reduce((prev, char) => {
    let glyph = bundle.glyphs[char] || bundle.defaultGlyph
    return prev + glyph.widthRatio * charHeight
  }, 0)
  const totalHeight = charHeight
  let x = position.x - anchor[0] * totalWidth
  let y = position.y - anchor[1] * totalHeight

  // push one quad per letter
  chars.forEach(char => {
    let glyph = bundle.glyphs[char] || bundle.defaultGlyph
    let width = glyph.widthRatio * charHeight
    mesh.pushQuad({
      minX: x - buffer,
      maxX: x + width + buffer,
      minY: y - buffer,
      maxY: y + totalHeight + buffer,
      color: color_,
      minU: glyph.minU,
      maxU: glyph.maxU,
      minV: glyph.minV,
      maxV: glyph.maxV
    })
    x += width
  })

  // apply to mesh
  mesh.commit()

  return mesh
}
