import { getOverlayManager } from './utils.overlay'
import { OverlayPanel } from './utils.overlay.panel'
import { AnchorType } from './enums'

export function initUI() {
	getOverlayManager().registerPanel(
		new OverlayPanel({
			position: { x: 0, y: 0 },
			parentAnchor: AnchorType.BOTTOMLEFT,
			fixedWidth: '100%',
			fixedHeight: 200
		})
	)
}
