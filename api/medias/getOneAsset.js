const { Media, GeneratedImage, Tag } = require('../../db/models')

module.exports.getOneAsset = async (req, res, next) => {
	try {
		const data = await Media.findByPk(req.params.id, {
			include: [GeneratedImage, Tag]
		})

		if(!data) {
			return res.status(404).json({ message: "Media not found." })
		}

		if(!['image/jpeg', 'image/png', 'image/webp'].includes(data.mime_type)) {
			delete data.GeneratedImages

			const responseData = {
				...data.dataValues,
				url: new URL(`${req.protocol}://${req.headers.host}/${data.path}`).toString()
			}
			return res.json(responseData)
		}

		const responseData = {
			...data.dataValues,
			url: new URL(`${req.protocol}://${req.headers.host}/${data.path}`).toString(),
			GeneratedImages: data.dataValues.GeneratedImages.map(image => {
				return {
					...image.dataValues,
					url: new URL(`${req.protocol}://${req.headers.host}/${image.path}`).toString()
				}
			})
		}

		res.json(responseData)

	} catch(err) { next(err) }
}
