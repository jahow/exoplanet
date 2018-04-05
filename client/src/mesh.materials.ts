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
      result = BABYLON.Color4.FromInts(255, 255, 255, 30)
      break;

    // minerals
    case Materials.MATERIAL_SILICATE:
    case Materials.MATERIAL_LIMESTONE:
    case Materials.MATERIAL_SAND:
    case Materials.MATERIAL_VOLCANIC_ROCK:
    case Materials.MATERIAL_METALLIC_ROCK:
    case Materials.MATERIAL_SALT:
      result = BABYLON.Color4.FromInts(180, 170, 20, 255)
      break;

    // liquids
    case Materials.MATERIAL_WATER:
    case Materials.MATERIAL_MERCURY:
    case Materials.MATERIAL_SULFURIC_ACID:
    case Materials.MATERIAL_SALT_WATER:
      result = BABYLON.Color4.FromInts(80, 255, 120, 150)
      break;

    default:
      result = BABYLON.Color4.FromInts(255, 0, 0, 255)
  }

	return result
}