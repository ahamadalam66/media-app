const path = require('path')
const fs = require('fs')
const { Media, GeneratedImage } = require('../../db/models')

module.exports.deleteOneAsset = async (req, res, next) => {

	try {

		const { id } = req.params
		const media = await Media.findByPk(id)

		if(!media) {
			return res.status(404).json({ message: 'Media not found.' })
		}

		const generated_images = await GeneratedImage.findAll({ where: { media_id: id } })
		await media.destroy()

		try {

			const files = generated_images.map(image => path.join(__dirname, '..', '..', image.path))
			files.push(path.join(__dirname, '..', '..', media.path))

			files.forEach(file => {
				try {
					fs.unlinkSync(file)
				} catch(err) {}
			})

		} catch(err) {}
		
		return res.json({ message: 'Media deleted successfully.' })
	} catch (err) { next(err) }
	
}
