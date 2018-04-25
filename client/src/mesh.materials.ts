import {getScene} from './globals'
import * as Materials from '../../shared/src/materials'
import {CellInfo} from './interfaces'

let genericMaterial: BABYLON.Material

/**
 * Will return a material using the generic shaders
 * No texture, only position & color
 */
export function getGenericMaterial(): BABYLON.Material {
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

export function getCellColor(cellInfo: CellInfo): BABYLON.Color4 {
	let result

  switch(cellInfo.class) {
    // gases
    case Materials.MATERIAL_HYDROGEN:
    case Materials.MATERIAL_OXYGEN:
    case Materials.MATERIAL_NITROGEN:
    case Materials.MATERIAL_CARBON_DIOXIDE:
    case Materials.MATERIAL_WATER_VAPOR:
    case Materials.MATERIAL_METHANE:
    case Materials.MATERIAL_SULFUR_DIOXIDE:
      result = BABYLON.Color4.FromInts(255, 255, 255, cellInfo.pressure / 255 * 30)
      break;

    // minerals
    case Materials.MATERIAL_SILICATE:
      result = BABYLON.Color4.FromInts(180, 170, 120, 255)
      break;
    case Materials.MATERIAL_LIMESTONE:
      result = BABYLON.Color4.FromInts(170, 170, 170, 255)
      break;
    case Materials.MATERIAL_SAND:
      result = BABYLON.Color4.FromInts(210, 210, 50, 255)
      break;
    case Materials.MATERIAL_VOLCANIC_ROCK:
      result = BABYLON.Color4.FromInts(30, 30, 30, 255)
      break;
    case Materials.MATERIAL_METALLIC_ROCK:
      result = BABYLON.Color4.FromInts(190, 80, 60, 255)
      break;
    case Materials.MATERIAL_SALT:
      result = BABYLON.Color4.FromInts(240, 240, 240, 255)
      break;

    // liquids
    case Materials.MATERIAL_WATER:
    case Materials.MATERIAL_MERCURY:
    case Materials.MATERIAL_SULFURIC_ACID:
    case Materials.MATERIAL_SALT_WATER:
      let invDensity = Math.max(0.2, 1 - cellInfo.pressure / 100)
      result = BABYLON.Color4.FromInts(80 * invDensity, 255 * invDensity, 120 * invDensity, 150)
      break;

    default:
      result = BABYLON.Color4.FromInts(255, 0, 0, 255)
  }

	return result
}