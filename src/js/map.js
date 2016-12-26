import Awesomplete from 'awesomplete'
import _ from 'lodash'

import { select } from './utils/dom.js'
import search from './search.js'

const mapzenKey = 'mapzen-PvGhJST'
const localStorageKey = 'bg-snow-totals-results'

const setStorageResults = ({ token, results }) => {

	// Try to retrieve the dictionary.
	let item = localStorage.getItem(localStorageKey)

	// If it doesn't exist yet,
	if (!item) {

		// create it.
		item = JSON.stringify({})

	}

	// Parse the dictionary.
	let dictionary = JSON.parse(item)

	// Update dictionary.
	dictionary[token] = results

	// Write to local storage.
	localStorage.setItem(localStorageKey, JSON.stringify(dictionary))

}

const getAllStorageResults = () => {

	// Try to retrieve the dictionary.
	let item = localStorage.getItem(localStorageKey)

	// If it doesn't exist yet,
	if (!item) {

		// create it.
		item = JSON.stringify({})

	}

	// Parse the dictionary.
	const dictionary = JSON.parse(item)

	// Get all the values.
	const results = _(dictionary)
		.values()
		.flatten()
		.sortBy('label')
		.uniqBy('label')
		.value()

	return results

}

const getStorageResultsByToken = (token) => {

	// Try to retrieve the dictionary.
	let item = localStorage.getItem(localStorageKey)

	// If it doesn't exist yet,
	if (!item) {

		// create it,
		item = JSON.stringify({})

		// and write to localStorage.
		localStorage.setItem(localStorageKey, item)
	}

	// Parse the dictionary.
	const dictionary = JSON.parse(item)

	// Return entry for this token.
	return dictionary[token]

}

const startMap = () => {

	// Select DOM map container.
	const mapElement = select('.observed-snowfall--map')

	// Create Mapzen map in map container.
	const map = L.Mapzen.map(mapElement, {
		apiKey: mapzenKey,
		center: [42.45, -73.089],
		zoom: 6.5,
		scene: 'assets/scene.yaml',
		minZoom: 2,
		maxZoom: 10,
		maxBounds: [
			[23.40276490540795, -130.869140625], // southwest
			[51.12421275782688, -58.00781249999999], // northeast
		],
	})

	map.attributionControl.addAttribution('Snowfall analysis <a href="https://www.nohrsc.noaa.gov/snowfall/">NOHRSC</a>')

	// Add locator button.
	const locator = L.Mapzen.locator()
	locator.addTo(map)

	// Keep track of map location in URL hash.
	L.Mapzen.hash({ map })

	const input = select('.js-search')
	const awesome = new Awesomplete(input, {
		sort: () => 0,
		maxItems: 5,
	})

	// When user selects dropdown entry, pan to corresponding location.
	window.addEventListener('awesomplete-selectcomplete', e => {

		// Get all cached results.
		const results = getAllStorageResults()

		// Try to find the selection.
		const { value } = e.text

		const match = _.find(results, { label: value })

		// If we got a match,
		if (match) {

			const [lon, lat] = match.coordinates

			// set the map to the right coordinates.
			map.setView([lat, lon], 10)

		}

	})

	input.addEventListener('input', e => {

		const { value } = e.target

		// If value is longer than 2 characters,
		if (value.length > 1) {

			// retrieve cached results.
			const results = getStorageResultsByToken(value)

			// If the result is not an array, it means we haven't searched
			// for this token yet. Do it.
			if (!results) {

				search(value, data => {

					// Set storage results for this token.
					setStorageResults({ token: value, results: data })

					// Update dropdown.
					awesome.list = data.map(v => v.label)

				})

			} else {

				// Otherwise, if it's an array, it means we have these results
				// in local storage. Update the dropdown.
				awesome.list = results.map(v => v.label)

			}

		}

	})

}

export default startMap
