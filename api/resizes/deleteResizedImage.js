const { generateImage } = require('../../utils/generateImage')
const { GeneratedImage } = require('../../db/models')

module.exports.deleteResizedImage = async (req, res, next) => {
	try {
		await GeneratedImage.destroy({ where: { id: req.params.id } })
		res.json({ message: 'Successfully deleted.' })
	} catch(err) { next(err) }
}
