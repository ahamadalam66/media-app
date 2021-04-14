const express = require('express')
const router = express.Router()

const { createResizedImage } = require('./createResizedImage')
const { deleteResizedImage } = require('./deleteResizedImage')

router.post('/', createResizedImage)
router.delete('/:id', deleteResizedImage)

module.exports = router
