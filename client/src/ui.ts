import { getOverlayManager } from './utils.overlay'
import { OverlayPanel, OverlayText } from './utils.overlay.panel'
import { AnchorTypes, ContentFlow } from './enums'

export function initUI() {
	const lowerContainer = new OverlayPanel({
		childAnchor: AnchorTypes.TOPLEFT,
		childFlow: ContentFlow.COL_INVERSE,
		position: {
			left: 0,
			right: 0,
			bottom: 0,
			top: '100% - 300'
		}
	})
	getOverlayManager().registerPanel(lowerContainer)
	for (let i = 0; i < 6; i++) {
		const item = new OverlayPanel({
			childAnchor: AnchorTypes.CENTER
		})
		item.setParent(lowerContainer)
		new OverlayText({}, `item ${i}`).setParent(item)
		getOverlayManager().registerPanel(item)
	}
}
