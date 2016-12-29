import * as request from 'd3-request'
import dateline from 'dateline'

import { select } from './utils/dom.js'
import setPathCookie from './utils/setPathCookie.js'
import removeMobileHover from './utils/removeMobileHover.js'
import wireSocialButtons from './utils/wireSocialButtons.js'
import startMap from './map.js'
import credits from './credits.js'

removeMobileHover()
setPathCookie()
credits()

// Add class to html if JS is loaded
document.querySelector('html').classList.add('js-is-loaded')

// Wire header social if present
if (document.querySelectorAll('.g-header__share').length) {
	wireSocialButtons({
		facebook: '.g-header__share-button--fb',
		twitter: '.g-header__share-button--tw',
	})
}

startMap()

request.json('/assets/snowtotals.topojson', (error, json) => {

	if (error) {

		console.error(error)

	} else {

		// Get the DOM element we are going to modify.
		const jsTime = select('.js-time')

		const { timestamp } = json

		if (timestamp) {

			// Split out timestamp string into various parts.
			const [year, month, date, hours, minutes ] = timestamp.split(/-|\s|:/)

			// Create a dateline-wrapped date.
			const wrapped = dateline(new Date(year, month - 1, date, hours, minutes))

			// Create the `datetime` attribute string.
			const datetimeAttr = `${year}-${month}-${date}T${hours}:${minutes}`

			// Create the human-readable string.
			const human = `${wrapped.getAPDate()}, ${wrapped.getAPTime({includeMinutes: true})}`


			// Set its innerHTML and datetime attribute.
			jsTime.innerHTML = human
			jsTime.setAttribute('datetime', datetimeAttr)

		} else {

			jsTime.innerHTML = 'No data available'

		}

	}

})










