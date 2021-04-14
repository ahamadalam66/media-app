const path = require('path')
const fs = require('fs')

function uploadDirectory() {

	return new Promise((resolve, reject) => {

		const date = new Date()
		const yyyy = String(date.getFullYear())
		let mm = date.getMonth() + 1

		if(mm > 9) {
			mm = String(mm)
		}else{
			mm = `0${String(mm)}`
		}

		const dir = path.join('uploads', yyyy, mm)

		try {
			if(!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true })
			}
			resolve(dir)
		} catch(err) {
			reject('Failed creating upload directory.')
		}

	})
}

module.exports = { uploadDirectory }
