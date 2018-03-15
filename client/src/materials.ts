let genericMaterial: BABYLON.Material

export function getGenericMaterial (scene: BABYLON.Scene) {
  if (!genericMaterial) {
    genericMaterial = new BABYLON.ShaderMaterial('generic', scene, './generic-shader',
      {
          attributes: ['position', 'color'],
          uniforms: ['worldViewProjection' ]
      });

    genericMaterial.backFaceCulling = false
    genericMaterial.needAlphaBlending = () => true
  }

  return genericMaterial
}