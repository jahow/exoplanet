import * as TinySDF from 'tiny-sdf'

let genericMaterial: BABYLON.Material

/**
 * Will return a material using the generic shaders
 * No texture, only position & color
 */
export function getGenericMaterial (scene: BABYLON.Scene): BABYLON.Material {
  if (!genericMaterial) {
    genericMaterial = new BABYLON.ShaderMaterial('generic', scene, './generic-shader',
      {
          attributes: ['position', 'color'],
          uniforms: ['worldViewProjection']
      })

    genericMaterial.backFaceCulling = false
  }

  return genericMaterial
}

const textMaterials: {[key: string]: BABYLON.Material} = {}

import {arrayFromRange} from './utils.misc'

/**
 * Will return a material with a glyph atlas attached, based on the provided
 * font & weight; uses 'text-shader'
 */
export function getTextMaterial (scene: BABYLON.Scene,
    fontFamily: string, fontWeight: 'normal' | 'bold'): BABYLON.Material {
  // check if it has already been created
  const key = fontFamily + '#' + fontWeight
  if (textMaterials[key]) {
    return textMaterials[key]
  }

  const textMaterial = new BABYLON.ShaderMaterial('text', scene, './text-shader',
    {
        attributes: ['position', 'color', 'uv'],
        uniforms: ['worldViewProjection', 'gamma', 'buffer'],
        samplers: ['glyphAtlas']
    })
  textMaterial.backFaceCulling = false

  // generate texture
  // atlases are 1024x1024 with 16 rows of glyphs
  const textureSize = 1024
  const rowHeight = 64
  const buffer = 4
  const fontSize = rowHeight - buffer * 2

  const texture = new BABYLON.DynamicTexture('glyph-atlas#' + key, {
      width: textureSize,
      height: textureSize
    }, scene, true)
  const ctx = texture.getContext()
  ctx.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily
  ctx.textBaseline = 'middle'

  // chars to draw
  // for now: latin basic and latin extended
  const chars = String.fromCharCode.apply(this, arrayFromRange(0x20, 0x7F)) +
    String.fromCharCode.apply(this, arrayFromRange(0xA0, 0xFF)) +
    '☹'

  // draw text
  const sdfGenerator = new TinySDF(fontSize, buffer, 8, 0.25, fontFamily, fontWeight)
  let x = 0, y = 0, width, values: ImageData, array, char, charIndex = 0
  while (charIndex < chars.length) {
    char = chars.substr(charIndex, 1)
    width = Math.ceil(ctx.measureText(char).width) + buffer * 2
    values = sdfGenerator.draw(char)

    if (x + width >= textureSize) {
      x = 0
      y += rowHeight
    }

    ctx.putImageData(values, x, y, 0, 0, width, rowHeight)
    x += width
    charIndex++
  }

  texture.update()

  textMaterial.setTexture('glyphAtlas', texture)
  textMaterial.setFloat('buffer', 0.75)
  textMaterial.setFloat('gamma', 0.03)

  textMaterials[key] = textMaterial

  return textMaterial
}