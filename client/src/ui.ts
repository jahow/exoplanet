import { getOverlayManager } from './utils.overlay'
import { OverlayPanel, OverlayText } from './utils.overlay.panel'
import { AnchorTypes, ContentFlow } from './enums'

export function initUI() {
	const lowerContainer = new OverlayPanel({
		childAnchor: AnchorTypes.TOPLEFT,
		childFlow: ContentFlow.COL_INVERSE,
		position: {
			left: 20,
			right: 20,
			bottom: 20,
			top: '100% - 200'
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

	const options = new OverlayPanel({
		childAnchor: AnchorTypes.CENTER,
		position: {
			top: 20,
			right: 20
		}
	})
	options.setParent(lowerContainer)
	new OverlayText({}, '+').setParent(options)
	getOverlayManager().registerPanel(options)
}
