const path = require('path')
const fs = require('fs')

function fileName(directory, filename) {

	const ext = path.extname(filename)
	const basename = path.basename(filename, path.extname(filename))

	return new Promise((resolve, reject) => {

		try {

			let i = 1
			let newFileName = filename
			let filePath = path.join(directory, newFileName)

			while(fs.existsSync(filePath)) {
				newFileName = `${basename}-${++i}${ext}`
				filePath = path.join(directory, newFileName)
			}

			resolve(newFileName)

		} catch(err) {
			reject('Failed creating file name.')
		}

	})
}

module.exports = { fileName }
