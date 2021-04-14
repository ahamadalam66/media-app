const path = require('path')
const sharp = require('sharp')

function generateImage(originalFile, width, height) {
	const query = JSON.stringify({ w: width, h: height })

	const ext = path.extname(originalFile)
	const dirname = path.dirname(originalFile)
	const basename = path.basename(originalFile, path.extname(originalFile))

	return new Promise(async (resolve, reject) => {
		try {

			const buffer = await sharp(originalFile)
									.withMetadata()
									.resize({ width, height })
									.toBuffer()

			const data = await sharp(buffer).metadata()
			const dimensions = `${data.width}x${data.height}`
			const dest = path.join(dirname, `${basename}-${dimensions}${ext}`)
			await sharp(buffer).toFile(dest)

			resolve({ dimensions, query, path: dest })
		} catch(err) {
			reject('Failed generating image.')
		}
	})

}

module.exports = { generateImage }
