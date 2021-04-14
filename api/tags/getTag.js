const { sequelize, Tag } = require('../../db/models')

module.exports.getTag = async (req, res, next) => {
	try {
		const data = await Tag.findAll({
			attributes: [[sequelize.fn('DISTINCT', sequelize.col('name')), 'name']],
		})
		res.json(data)
	} catch(err) { next(err) }
}
