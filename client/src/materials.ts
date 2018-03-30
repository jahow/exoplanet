import {getScene} from './globals'

let genericMaterial: BABYLON.Material

/**
 * Will return a material using the generic shaders
 * No texture, only position & color
 */
export function getGenericMaterial (): BABYLON.Material {
  if (!genericMaterial) {
    genericMaterial = new BABYLON.ShaderMaterial('generic', getScene(), './generic-shader',
      {
          attributes: ['position', 'color'],
          uniforms: ['worldViewProjection']
      })

    genericMaterial.backFaceCulling = false
  }

  return genericMaterial
}
