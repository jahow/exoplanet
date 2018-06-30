import { ExtendedMesh } from './utils.geom'
import { AnchorType, RenderingGroup } from './enums'
import { getCanvas } from './globals'
import { getOverlayManager } from './utils.overlay'

type LayoutDimension = string | number

interface BaseAttributes {
	position: { x: LayoutDimension; y: LayoutDimension }
	parentAnchor: AnchorType
	parent?: BasePanel
}

interface PanelAttributes extends BaseAttributes {
	fixedWidth?: LayoutDimension
	expandWidth?: boolean
	fixedHeight?: LayoutDimension
	expandHeight?: boolean
	hasBorder?: boolean
	hasBackground?: boolean
}

export class BasePanel {
	constructor() {}
}

export class OverlayPanel extends BasePanel {
	mesh: ExtendedMesh
	attrs: PanelAttributes
	children: OverlayPanel[]

	constructor(attrs: PanelAttributes) {
		super()

		this.attrs = attrs

		this.mesh = new ExtendedMesh('panel', getOverlayManager().getScene())
		this.mesh.renderingGroupId = RenderingGroup.OVERLAY
		this.mesh.visibility = 0.9999
		this.mesh.alwaysSelectAsActiveMesh = true
		this.mesh.material = getOverlayManager().getPanelMaterial()

		// add quad to mesh
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
	}
}

interface TextAttributes extends BaseAttributes {
	maxWidth?: LayoutDimension
}

export class OverlayText extends BasePanel {
	mesh: ExtendedMesh
	attrs: TextAttributes
	text: string

	constructor(attrs: TextAttributes) {
		super()

		this.attrs = attrs
	}
}
