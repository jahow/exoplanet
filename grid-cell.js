import * as Materials from './materials'

export function createCell () {
  return {
    class: Materials.MATERIAL_VOID,
    amount: 0,
    pressure: 0,
    temperature: 0
  }
}
