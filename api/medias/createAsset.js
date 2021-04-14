const multer  = require('multer')
const sharp = require('sharp')
const path = require('path')

const { sequelize, Media, GeneratedImage } = require('../../db/models')

const { generateImage } = require('../../utils/generateImage')
const { uploadDirectory } = require('../../utils/uploadDirectory')
const { fileName } = require('../../utils/fileName')

module.exports.createAsset = async (req, res, next) => {

	try {

		const uploadDir = await uploadDirectory()

		const storage = multer.diskStorage({
		  destination: function (req, file, cb) {
		    cb(null, uploadDir)
		  },
		  filename: async function (req, file, cb) {
		  	const name = await fileName(path.join(__dirname, '..', '..', uploadDir), file.originalname)
		    cb(null, name)
		  }
		})

		const upload = multer({ storage })
		const uploadFile = upload.single('files')

		uploadFile(req, res, async function (err) {
			
		    if (err instanceof multer.MulterError) {
		      // A Multer error occurred when uploading.
		      return res.status(500).json({ message: 'Something went wrong.' })
		    } else if (err) {
		      // An unknown error occurred when uploading.
		      return res.status(500).json({ message: 'Something went wrong.' })
		    }

		    const { filename, mimetype, size } = req.file
		    const filepath = req.file.path

		    if(['image/jpeg', 'image/png', 'image/webp'].includes(mimetype)) {

		    		const image = sharp(filepath)
		    		const { width, height } = await image.metadata()
		    		const dimensions = `${width}x${height}`

		    		const thumb = await generateImage(filepath, 200)
		    		const small = await generateImage(filepath, 400)

		    		await sequelize.transaction(async t => {

					    const media = await Media.create({
					    	name: filename,
					    	mime_type: mimetype,
					    	path: filepath,
					    	size,
					    	dimensions
					    }, { transaction: t })

					    await GeneratedImage.bulkCreate([
						    {
									media_id: media.id,
									dimensions: thumb.dimensions,
									path: thumb.path,
									query: thumb.query,
								},
								{
									media_id: media.id,
									dimensions: small.dimensions,
									path: small.path,
									query: small.query,
								}
							], { transaction: t })

					  })

				    res.status(201).json({ message: 'File uploaded successfully.' })

		    }else{
		 
			    // Everything went fine.
			    await Media.create({
			    	name: filename,
			    	mime_type: mimetype,
			    	path: filepath,
			    	size
			    })

			    res.status(201).json({ message: 'File uploaded successfully.' })
			}
		})

	} catch(err) { next(err) }

}
