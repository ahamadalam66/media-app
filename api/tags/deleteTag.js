const { Tag } = require('../../db/models')

module.exports.deleteTag = async (req, res, next) => {
	try {
		await Tag.destroy({ where: { id: req.params.id } })
		res.json({ message: 'Successfully deleted tag.' })
	} catch(err) { next(err) }
}
