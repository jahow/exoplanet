export const MATERIAL_VOID = 0x00

// gases
export const MATERIAL_HYDROGEN = 0x01
export const MATERIAL_OXYGEN = 0x02
export const MATERIAL_NITROGEN = 0x03
export const MATERIAL_CARBON_DIOXIDE = 0x04
export const MATERIAL_WATER_VAPOR = 0x05
export const MATERIAL_METHANE = 0x06
export const MATERIAL_SULFUR_DIOXIDE = 0x07

// minerals
export const MATERIAL_SILICATE = 0x20
export const MATERIAL_LIMESTONE = 0x21
export const MATERIAL_SAND = 0x22
export const MATERIAL_VOLCANIC_ROCK = 0x23
export const MATERIAL_METALLIC_ROCK = 0x24
export const MATERIAL_SALT = 0x25

// liquids
export const MATERIAL_WATER = 0x40
export const MATERIAL_MERCURY = 0x41
export const MATERIAL_SULFURIC_ACID = 0x42
export const MATERIAL_SALT_WATER = 0x43

function clamp (v) {
  return Math.min(Math.max(v || 0, 0), 0xFF)
}

/**
 * Returns an integer representing a materials info for a cell
 * 0x FF - class
 *      FF - amount
 *        FF - pressure
 *          FF - temperature
 * @param {CellInfo} cellInfo
 */
export function encodeMaterialInfo (cellInfo) {
  return clamp(cellInfo.class) << 32 +
    clamp(cellInfo.amount) << 24 +
    clamp(cellInfo.pressure) << 16 +
    clamp(cellInfo.temperature)
}

/**
 * Returns a {CellInfo} object from encoded values
 * @param {number} value
 */
export function decodeMaterialInfo (value) {
  return {
    class: (value >> 32) & 0xFF,
    amount: (value >> 24) & 0xFF,
    pressure: (value >> 16) & 0xFF,
    temperature: value & 0xFF
  }
}
