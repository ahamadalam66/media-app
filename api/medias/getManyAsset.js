const { Op } = require('sequelize')
const { Media, Tag } = require('../../db/models')

module.exports.getManyAsset = async (req, res, next) => {

	try {

		let { filter, range } = req.query
		filter = JSON.parse(filter)
		range = JSON.parse(range)

		const options = {
			offset: range[0],
			limit: range[1] - range[0] + 1,
			order: [ ['uploaded_at', 'desc'] ],
			raw: true
		}

		const filters = {}

		// search filter
		if(filter['s'] && filter['searchType'] !== 'tag') {
			filters.name = {
				[Op.like]: `%${filter['s']}%`
			} 	
		}

		switch(filter['searchType']) {
			case 'image': 
					filters.mime_type = {
						[Op.like]: `%image%`
					}
					break;

			case 'video': 
					filters.mime_type = {
						[Op.like]: `%video%`
					}
					break;

			case 'tag':
					options.include = [{
						model: Tag,
						where: {
							name: { [Op.like]: `%${filter['s']}%` }
						}
					}] 
		}

		options.where = filters

		const data = await Media.findAndCountAll(options)

		data.rows = data.rows.map(asset => ({
			...asset,
			url: new URL(`${req.protocol}://${req.headers.host}/${asset.path}`).toString()
		}))

		res.json(data)

	} catch(err) { next(err) }

}
