const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const { Media, GeneratedImage } = require('../../db/models')

module.exports.deleteManyAsset = async (req, res, next) => {
	try {
		let { ids } = req.query 
		ids = JSON.parse(ids)
		
		const multiple_media = await Media.findAll({ where: { id: { [Op.in]: ids } } })
		const multiple_generated_images = await GeneratedImage.findAll({ where: { media_id: { [Op.in]: ids } } })

		await Media.destroy({ where: { id: { [Op.in]: ids } } })

		try {

			const files1 = multiple_media.map(media => path.join(__dirname, '..', '..', media.path))
			const files2 = multiple_generated_images.map(image => path.join(__dirname, '..', '..', image.path))

			const files = files1.concat(files2)
			
			files.forEach(file => {
				try {
					fs.unlinkSync(file)
				} catch(err) { console.log(err) }
			})

		} catch(err) { console.log(err) }
		
		return res.json({ message: `Successfully deleted ${ids.length} files.` })
	} catch (err) { next(err) }
}
