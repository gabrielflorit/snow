import fs from 'fs-extra'
import _ from 'lodash'
import moment from 'moment-timezone'

let topo = fs.readJsonSync('./output/snowtotals.topojson')
const reports = fs.readJsonSync('./output/allReports.geojson')

const timestamp = _(reports.features)
	.map('properties.DateTime_Report(UTC)')
	.map(v => moment.utc(v.trim(), 'YYYY-MM-DD HH:mm'))
	.sortBy()
	.last()

topo.timestamp = timestamp.tz('America/New_York').format('YYYY-MM-DD HH:mm')
fs.writeJsonSync('./output/snowtotals.topojson', topo)