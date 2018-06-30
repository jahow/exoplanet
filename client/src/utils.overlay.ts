import { getScene, getCanvas } from './globals'
import { BasePanel } from './utils.overlay.panel'
import { ExtendedMesh } from './utils.geom'
import { RenderingGroup } from './enums'

class OverlayManager {
	panelMaterial: BABYLON.ShaderMaterial
	renderTarget: BABYLON.RenderTargetTexture
	panels: BasePanel[]

	constructor() {
		this.panels = []

		this.panelMaterial = new BABYLON.ShaderMaterial(
			'overlayshader',
			getScene(),
			'./overlay',
			{
				attributes: ['position', 'color'],
				uniforms: ['worldViewProjection', 'blurRender']
			}
		)

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
		this.panelMaterial.setTexture('blurRender', this.renderTarget)

		// add horizontal & vertical blurs (+ workaround to not apply to all scene)
		const kernel = 20.0
		const camera = new BABYLON.Camera(
			'unused',
			BABYLON.Vector3.Zero(),
			getScene()
		)
		const ppBlurH = new BABYLON.BlurPostProcess(
			'Horizontal blur',
			new BABYLON.Vector2(1.0, 0),
			kernel,
			1.0,
			camera
		)
		const ppBlurV = new BABYLON.BlurPostProcess(
			'Vertical blur',
			new BABYLON.Vector2(0, 1.0),
			kernel,
			1.0,
			camera
		)
		this.renderTarget.addPostProcess(ppBlurH)
		this.renderTarget.addPostProcess(ppBlurV)
		camera.detachPostProcess(ppBlurH)
		camera.detachPostProcess(ppBlurV)

		this.handleResize()
	}

	getPanelMaterial() {
		return this.panelMaterial
	}

	handleResize() {
		this.panelMaterial.setMatrix(
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
		// update render list to include all meshes but the ones from UI
		this.renderTarget.renderList = getScene().meshes.filter(
			mesh => mesh.renderingGroupId !== RenderingGroup.UI
		)
	}

	registerPanel(panel: BasePanel) {
		this.panels.push(panel)
	}
}

let overlayManager: OverlayManager
export function getOverlayManager() {
	if (!overlayManager) {
		overlayManager = new OverlayManager()
	}
	return overlayManager
}
