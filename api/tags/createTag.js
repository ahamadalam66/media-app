const { Tag } = require('../../db/models')

module.exports.createTag = async (req, res, next) => {
	try {
		await Tag.create({ name: req.body.name, media_id: req.body.mediaId })
		res.json({ message: 'Successfully added tag.' })
	} catch(err) { next(err) }
}
