const { Media } = require('../../db/models')

module.exports.updateAsset = async (req, res, next) => {
	try {
		const { id, name, description, alt } = req.body
		await Media.update({ name, description, alt }, { where: { id } })
		res.json({ message: 'Successfully updated.' })

	} catch(err) { next(err) }
}
