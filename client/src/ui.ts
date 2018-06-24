import { ExtendedMesh } from './utils.geom'
import { getScene, getCanvas } from './globals'
import { getCamera } from './utils.view'

export class Overlay {
	mesh: ExtendedMesh
	material: BABYLON.ShaderMaterial
	renderTarget: BABYLON.RenderTargetTexture

	constructor() {
		this.mesh = new ExtendedMesh('overlay', getScene())
		this.mesh.renderingGroupId = 3
		this.mesh.visibility = 0.9999
		this.mesh.alwaysSelectAsActiveMesh = true

		this.material = new BABYLON.ShaderMaterial(
			'overlayshader',
			getScene(),
			'./overlay',
			{
				attributes: ['position', 'color'],
				uniforms: ['worldViewProjection', 'blurRender']
			}
		)
		this.mesh.material = this.material
		// this.mesh.material.sideOrientation = BABYLON.Mesh.DOUBLESIDE

		// render target texture
		const ratio = 0.125
		this.renderTarget = new BABYLON.RenderTargetTexture(
			'blurRender',
			{
				width: getCanvas().width * ratio,
				height: getCanvas().height * ratio
			},
			getScene(),
			false,
			true
		)
		getScene().customRenderTargets.push(this.renderTarget)
		this.material.setTexture('blurRender', this.renderTarget)

		// add horizontal & vertical blurs (+ workaround to not apply to all scene)
		const kernel = 20.0
		const ppBlurH = new BABYLON.BlurPostProcess(
			'Horizontal blur',
			new BABYLON.Vector2(1.0, 0),
			kernel,
			1.0,
			getCamera()
		)
		const ppBlurV = new BABYLON.BlurPostProcess(
			'Vertical blur',
			new BABYLON.Vector2(0, 1.0),
			kernel,
			1.0,
			getCamera()
		)
		this.renderTarget.addPostProcess(ppBlurH)
		this.renderTarget.addPostProcess(ppBlurV)
		getCamera().detachPostProcess(ppBlurH)
		getCamera().detachPostProcess(ppBlurV)

		this.handleResize()
	}

	handleResize() {
		this.mesh
			.clearVertices()
			.pushQuad({
				minX: 0,
				maxX: getCanvas().width,
				minY: 0,
				maxY: 200,
				color: BABYLON.Color4.FromInts(100, 100, 100, 255)
			})
			.commit()

		this.material.setMatrix(
			'worldViewProjection',
			BABYLON.Matrix.OrthoOffCenterRH(
				0,
				getCanvas().width,
				0,
				getCanvas().height,
				10,
				-10
			)
		)
	}

	update() {
		// update render list to include all meshes but our one
		this.renderTarget.renderList = getScene().meshes.filter(
			mesh => mesh !== this.mesh
		)
	}
}
