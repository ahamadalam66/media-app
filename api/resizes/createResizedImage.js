const { generateImage } = require('../../utils/generateImage')
const { Media, GeneratedImage } = require('../../db/models')

module.exports.createResizedImage =  async (req, res, next) => {
	try {

		let { mediaId, w, h } = req.body
		
		const media = await Media.findByPk(mediaId, {
			include: GeneratedImage 
		})

		if( (!media) || (w && isNaN(w)) || (h && isNaN(h)) || (!w && !h) ) {
			return res.status(400).json({ message: 'Invalid input parameter.' })
		}

		if(w) {
			w = parseInt(w)
		}

		if(h) {
			h = parseInt(h)
		} 

		if(!['image/jpeg', 'image/png', 'image/webp'].includes(media.mime_type)) {
			return res.sendFile(path.join(__dirname, '..', _path))
		}

		const query = JSON.stringify({ w, h })
					
		const _image = media.GeneratedImages.find(image => image.query === query)

		if(_image) {
			return res.status(400).json({ message: 'Already resized with the dimensions.' })
		}
		// generate image
		const data = await generateImage(media.path, w, h)
		await GeneratedImage.create({
			media_id: media.id,
			dimensions: data.dimensions,
			path: data.path,
			query: data.query,
		})
		return res.json({ message: 'Successfully resized.' })

	} catch(err) { next(err) }
}
