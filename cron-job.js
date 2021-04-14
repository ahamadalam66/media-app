const cron = require('node-cron')
const path = require('path')
const { exec } = require('child_process')

if(process.env.NODE_ENV !== 'production') {
  	require('dotenv').config()
}

const commands = [
	`mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > database-backup-${new Date().toJSON().substr(0, 10)}.sql`,
	'git add .',
	`git commit -m "updated-at-${new Date().toJSON()}"`,
	'git push origin master'
]

cron.schedule('53 * * * *', () => {
	for(let i = 0; i < commands.length; i++) {
		console.log(commands[i])

		exec(commands[i], (error, stdout, stderr) => {
		  if (error) {
		    console.error(error)
		    return
		  }
		  console.log(`stdout: ${stdout}`)
		  console.error(`stderr: ${stderr}`)
		})

	}
	console.log('Data successfully backed up.')
 
}, { timezone: 'Asia/Kolkata' })
