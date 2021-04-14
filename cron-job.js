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

cron.schedule('17 * * * *', () => {

	exec(commands.join('&'), (error, stdout, stderr) => {
	  if (error) {
	    return console.error(error)
	  }
	  if(stderr) console.log(stderr)
	  if(stdout) console.log(stdout)
	})
 
}, { timezone: 'Asia/Kolkata' })
